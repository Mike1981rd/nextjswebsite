'use client';

import { useState, useEffect } from 'react';
import { Calendar, Download, Upload, Settings, Filter, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import AvailabilityGrid from '@/components/availability/AvailabilityGrid';
import BlockPeriodModal from '@/components/availability/BlockPeriodModal';
import RulesManager from '@/components/availability/RulesManager';
import StatsWidget from '@/components/availability/StatsWidget';

export default function AvailabilityPage() {
  const contextData = useI18n();
  console.log('Context data:', contextData);
  const { t, language } = contextData;
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'year'>('month');
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [availabilityData, setAvailabilityData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [currentDate, selectedRoom, viewMode]);

  const getStartOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const getEndOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const startDate = getStartOfMonth(currentDate);
      const endDate = getEndOfMonth(currentDate);
      const apiUrl = 'http://localhost:5266/api';

      const [gridResponse, statsResponse, roomsResponse] = await Promise.all([
        fetch(`${apiUrl}/availability/grid?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}${selectedRoom ? `&roomId=${selectedRoom}` : ''}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(res => res.json()),
        fetch(`${apiUrl}/availability/stats?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(res => res.json()),
        fetch(`${apiUrl}/rooms`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }).then(res => res.json())
      ]);

      setAvailabilityData(gridResponse);
      setStats(statsResponse);
      setRooms(roomsResponse);
    } catch (error) {
      console.error('Error loading availability data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSyncReservations = async () => {
    try {
      await fetch('http://localhost:5266/api/availability/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      await loadData();
    } catch (error) {
      console.error('Error syncing reservations:', error);
    }
  };

  const handleExport = () => {
    console.log('Exporting availability data...');
  };

  // Debugging - check if translations are loaded properly
  console.log('Testing translation:', t('availability.title', 'Default Title'));
  console.log('Type of t:', typeof t);
  console.log('t function:', t);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('availability.title', 'Room Availability')}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('availability.subtitle', 'Manage room availability and pricing')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncReservations}
            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-700"
          >
            <Upload className="w-4 h-4" />
            {t('availability.sync', 'Sync')}
          </button>

          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:border-gray-700"
          >
            <Download className="w-4 h-4" />
            {t('availability.export', 'Export')}
          </button>

          <button
            onClick={() => setShowBlockModal(true)}
            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            <Calendar className="w-4 h-4" />
            {t('availability.blockPeriodButton', 'Block Period')}
          </button>

          <button
            onClick={() => setShowRulesModal(true)}
            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30"
          >
            <Settings className="w-4 h-4" />
            {t('availability.rulesButton', 'Rules')}
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
          >
            <Filter className="w-4 h-4" />
            {t('common.filters', 'Filters')}
          </button>
        </div>
      </div>

      {/* Temporarily commented stats
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatsWidget
            title={t('availability.stats.occupancy', 'Occupancy Rate')}
            value={`${stats.occupancyRate?.toFixed(1) || 0}%`}
            icon={<Info className="w-5 h-5" />}
            trend={stats.occupancyTrend}
          />
          <StatsWidget
            title={t('availability.stats.available', 'Available Today')}
            value={stats.availableToday || 0}
            icon={<Calendar className="w-5 h-5" />}
          />
          <StatsWidget
            title={t('availability.stats.checkIns', 'Check-ins Today')}
            value={stats.checkInsToday || 0}
            icon={<Calendar className="w-5 h-5" />}
          />
          <StatsWidget
            title={t('availability.stats.revenue', 'Projected Revenue')}
            value={`$${stats.projectedRevenue?.toLocaleString() || 0}`}
            icon={<Info className="w-5 h-5" />}
            trend={stats.revenueTrend}
          />
        </div>
      )}
      */}

      {/* Temporarily commented filters
      {showFilters && (
        <div className="mb-6 p-4 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t('availability.filters.room', 'Room')}
              </label>
              <select
                value={selectedRoom || ''}
                onChange={(e) => setSelectedRoom(e.target.value ? Number(e.target.value) : null)}
                className="px-3 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">{t('availability.filters.allRooms', 'All Rooms')}</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} ({room.roomCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                {t('availability.filters.view', 'View')}
              </label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="px-3 py-2 rounded-lg border bg-white border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="month">{t('availability.filters.month', 'Month')}</option>
                <option value="week">{t('availability.filters.week', 'Week')}</option>
                <option value="year">{t('availability.filters.year', 'Year')}</option>
              </select>
            </div>
          </div>
        </div>
      )}
      */}

      <div className="rounded-lg overflow-hidden bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePreviousMonth}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-700 dark:text-gray-400"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentDate.toLocaleDateString(language === 'es' ? 'es-DO' : 'en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h2>

              <button
                onClick={handleNextMonth}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-700 dark:text-gray-400"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleToday}
                className="px-3 py-1 text-sm rounded-lg transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {t('availability.today', 'Today')}
              </button>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('availability.showing', 'Showing')} {availabilityData?.totalRooms || 0} {t('availability.rooms', 'rooms')}
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : availabilityData ? (
            <AvailabilityGrid
              data={availabilityData}
              onDateClick={(roomId, date) => {
                console.log('Date clicked:', roomId, date);
              }}
              onRefresh={loadData}
            />
          ) : (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              {t('availability.noData', 'No availability data')}
            </div>
          )}
        </div>
      </div>

      {showBlockModal && (
        <BlockPeriodModal
          isOpen={showBlockModal}
          onClose={() => setShowBlockModal(false)}
          onSave={() => {
            setShowBlockModal(false);
            loadData();
          }}
          rooms={rooms}
          isDark={false}
        />
      )}

      {showRulesModal && (
        <RulesManager
          isOpen={showRulesModal}
          onClose={() => setShowRulesModal(false)}
          onSave={() => {
            setShowRulesModal(false);
            loadData();
          }}
          rooms={rooms}
          isDark={false}
        />
      )}
    </div>
  );
}