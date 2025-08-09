using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebsiteBuilderAPI.Data;
using WebsiteBuilderAPI.DTOs.Rooms;
using WebsiteBuilderAPI.Models;

namespace WebsiteBuilderAPI.Services
{
    public interface IRoomService
    {
        Task<List<RoomResponseDto>> GetAllAsync(int companyId);
        Task<RoomResponseDto?> GetByIdAsync(int companyId, int id);
        Task<RoomResponseDto> CreateAsync(int companyId, CreateRoomDto dto);
        Task<RoomResponseDto?> UpdateAsync(int companyId, int id, UpdateRoomDto dto);
        Task<bool> DeleteAsync(int companyId, int id);
        Task<bool> ExistsAsync(int companyId, int id);
    }

    public class RoomService : IRoomService
    {
        private readonly ApplicationDbContext _context;

        public RoomService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<RoomResponseDto>> GetAllAsync(int companyId)
        {
            var rooms = await _context.Rooms
                .Where(r => r.CompanyId == companyId)
                .OrderBy(r => r.RoomCode ?? r.Name)
                .ToListAsync();

            return rooms.Select(MapToDto).ToList();
        }

        public async Task<RoomResponseDto?> GetByIdAsync(int companyId, int id)
        {
            var room = await _context.Rooms
                .FirstOrDefaultAsync(r => r.Id == id && r.CompanyId == companyId);

            return room != null ? MapToDto(room) : null;
        }

        public async Task<RoomResponseDto> CreateAsync(int companyId, CreateRoomDto dto)
        {
            var room = new Room
            {
                CompanyId = companyId,
                Name = dto.Name,
                Description = dto.Description,
                BasePrice = dto.BasePrice,
                ComparePrice = dto.ComparePrice,
                MaxOccupancy = dto.MaxOccupancy,
                RoomCode = dto.RoomCode,
                RoomType = dto.RoomType,
                FloorNumber = dto.FloorNumber,
                ViewType = dto.ViewType,
                SquareMeters = dto.SquareMeters,
                Tags = dto.Tags,
                Amenities = dto.Amenities,
                Images = dto.Images,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return MapToDto(room);
        }

        public async Task<RoomResponseDto?> UpdateAsync(int companyId, int id, UpdateRoomDto dto)
        {
            var room = await _context.Rooms
                .FirstOrDefaultAsync(r => r.Id == id && r.CompanyId == companyId);

            if (room == null)
                return null;

            // Actualizar solo los campos proporcionados - manejar strings vacíos explícitamente
            if (dto.Name != null && dto.Name != "")
                room.Name = dto.Name;
            
            // Description puede ser vacío (null)
            if (dto.Description != null)
                room.Description = dto.Description == "" ? null : dto.Description;
            
            if (dto.BasePrice.HasValue) 
                room.BasePrice = dto.BasePrice.Value;
            
            // ComparePrice: si se envía 0, se interpreta como eliminar el precio de comparación
            if (dto.ComparePrice.HasValue)
                room.ComparePrice = dto.ComparePrice.Value == 0 ? null : dto.ComparePrice.Value;
            
            if (dto.MaxOccupancy.HasValue) 
                room.MaxOccupancy = dto.MaxOccupancy.Value;
            
            // RoomCode puede ser vacío (null)
            if (dto.RoomCode != null)
                room.RoomCode = dto.RoomCode == "" ? null : dto.RoomCode;
            
            // RoomType puede ser vacío (null)
            if (dto.RoomType != null)
                room.RoomType = dto.RoomType == "" ? null : dto.RoomType;
            
            // FloorNumber: si se envía 0, se interpreta como planta baja, no como eliminar
            if (dto.FloorNumber.HasValue)
                room.FloorNumber = dto.FloorNumber.Value;
            
            // ViewType puede ser vacío (null)
            if (dto.ViewType != null)
                room.ViewType = dto.ViewType == "" ? null : dto.ViewType;
            
            // SquareMeters: si se envía 0, se interpreta como eliminar el valor
            if (dto.SquareMeters.HasValue)
                room.SquareMeters = dto.SquareMeters.Value == 0 ? null : dto.SquareMeters.Value;
            
            // Tags y Amenities: lista vacía es válida
            if (dto.Tags != null) 
                room.Tags = dto.Tags;
            
            if (dto.Amenities != null) 
                room.Amenities = dto.Amenities;
            
            if (dto.Images != null) 
                room.Images = dto.Images;
            
            if (dto.IsActive.HasValue) 
                room.IsActive = dto.IsActive.Value;

            room.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToDto(room);
        }

        public async Task<bool> DeleteAsync(int companyId, int id)
        {
            var room = await _context.Rooms
                .FirstOrDefaultAsync(r => r.Id == id && r.CompanyId == companyId);

            if (room == null)
                return false;

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ExistsAsync(int companyId, int id)
        {
            return await _context.Rooms
                .AnyAsync(r => r.Id == id && r.CompanyId == companyId);
        }

        private static RoomResponseDto MapToDto(Room room)
        {
            return new RoomResponseDto
            {
                Id = room.Id,
                CompanyId = room.CompanyId,
                Name = room.Name,
                Description = room.Description,
                BasePrice = room.BasePrice,
                ComparePrice = room.ComparePrice,
                MaxOccupancy = room.MaxOccupancy,
                RoomCode = room.RoomCode,
                RoomType = room.RoomType,
                FloorNumber = room.FloorNumber,
                ViewType = room.ViewType,
                SquareMeters = room.SquareMeters,
                Tags = room.Tags,
                Amenities = room.Amenities,
                Images = room.Images,
                IsActive = room.IsActive,
                CreatedAt = room.CreatedAt,
                UpdatedAt = room.UpdatedAt
            };
        }
    }
}