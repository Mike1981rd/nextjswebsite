'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Calendar, Users, MapPin, Mail, Phone, Home, Printer, Download } from 'lucide-react';
import Link from 'next/link';

interface ReservationDetails {
  id: number;
  confirmationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  currency: string;
  status: string;
  specialRequests?: string;
  roomImage?: string;
  roomLocation?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export default function ReservationConfirmedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [primaryColor, setPrimaryColor] = useState('#22c55e');

  useEffect(() => {
    // Get UI settings
    const settings = localStorage.getItem('ui-settings');
    if (settings) {
      try {
        const parsed = JSON.parse(settings);
        setPrimaryColor(parsed.primaryColor || '#22c55e');
      } catch (e) {
        console.error('Error parsing settings:', e);
      }
    }

    // Load reservation details
    loadReservationDetails();
  }, []);

  const loadReservationDetails = async () => {
    try {
      const id = searchParams.get('id');
      const confirmationNumber = searchParams.get('confirmation');
      
      if (!id && !confirmationNumber) {
        // No reservation info, redirect to home
        router.push('/');
        return;
      }

      // For now, create mock data - in production, fetch from API
      const mockReservation: ReservationDetails = {
        id: parseInt(id || '1'),
        confirmationNumber: confirmationNumber || 'RES000001',
        customerName: 'Juan Pérez',
        customerEmail: 'juan@email.com',
        customerPhone: '+503 7777-8888',
        roomName: 'Suite Ejecutiva con Vista al Mar',
        checkInDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        checkOutDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        numberOfGuests: 2,
        totalAmount: 450.00,
        currency: 'USD',
        status: 'Confirmed',
        specialRequests: 'Late check-in requested',
        roomImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
        roomLocation: 'Piso 5, Habitación 502',
        checkInTime: '15:00',
        checkOutTime: '12:00'
      };

      setReservation(mockReservation);
    } catch (error) {
      console.error('Error loading reservation:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat('es-ES', { 
        style: 'currency', 
        currency: currency 
      }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(2)}`;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In production, this would generate and download a PDF
    alert('La funcionalidad de descarga de PDF estará disponible pronto');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando confirmación...</p>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No se encontró la reservación</p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8" style={{ backgroundColor: `${primaryColor}10` }}>
            <div className="flex items-center justify-center mb-4">
              <div 
                className="rounded-full p-3"
                style={{ backgroundColor: primaryColor }}
              >
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
              ¡Reservación Confirmada!
            </h1>
            <p className="text-center text-gray-600">
              Tu reservación ha sido procesada exitosamente
            </p>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="text-center text-sm text-gray-500 mb-1">Número de confirmación</p>
              <p className="text-center text-2xl font-bold" style={{ color: primaryColor }}>
                {reservation.confirmationNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Reservation Details */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalles de la Reservación</h2>
            
            {/* Room Info */}
            <div className="mb-6">
              {reservation.roomImage && (
                <img 
                  src={reservation.roomImage} 
                  alt={reservation.roomName}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-lg font-medium text-gray-900 mb-2">{reservation.roomName}</h3>
              {reservation.roomLocation && (
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {reservation.roomLocation}
                </p>
              )}
            </div>

            {/* Check-in/out Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" style={{ color: primaryColor }} />
                  Check-in
                </h4>
                <p className="text-gray-600">{formatDate(reservation.checkInDate)}</p>
                {reservation.checkInTime && (
                  <p className="text-sm text-gray-500">A partir de las {reservation.checkInTime}</p>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" style={{ color: primaryColor }} />
                  Check-out
                </h4>
                <p className="text-gray-600">{formatDate(reservation.checkOutDate)}</p>
                {reservation.checkOutTime && (
                  <p className="text-sm text-gray-500">Antes de las {reservation.checkOutTime}</p>
                )}
              </div>
            </div>

            {/* Guest Info */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Users className="w-5 h-5 mr-2" style={{ color: primaryColor }} />
                Información del Huésped
              </h4>
              <div className="space-y-2">
                <p className="text-gray-600">{reservation.customerName}</p>
                <p className="text-gray-600 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {reservation.customerEmail}
                </p>
                {reservation.customerPhone && (
                  <p className="text-gray-600 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {reservation.customerPhone}
                  </p>
                )}
                <p className="text-gray-600">
                  Número de huéspedes: {reservation.numberOfGuests}
                </p>
              </div>
            </div>

            {/* Special Requests */}
            {reservation.specialRequests && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Solicitudes Especiales</h4>
                <p className="text-gray-600 italic">{reservation.specialRequests}</p>
              </div>
            )}

            {/* Total Amount */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total Pagado</span>
                <span className="text-2xl font-bold" style={{ color: primaryColor }}>
                  {formatCurrency(reservation.totalAmount, reservation.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="font-medium text-gray-900 mb-3">Información Importante</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• Se ha enviado un email de confirmación a {reservation.customerEmail}</li>
            <li>• Por favor presenta tu número de confirmación al hacer check-in</li>
            <li>• Si necesitas hacer cambios, contáctanos lo antes posible</li>
            <li>• Revisa nuestras políticas de cancelación en el email de confirmación</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Printer className="w-5 h-5 mr-2" />
            Imprimir Confirmación
          </button>
          
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <Download className="w-5 h-5 mr-2" />
            Descargar PDF
          </button>
          
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-lg font-medium text-white transition-colors flex items-center justify-center"
            style={{ backgroundColor: primaryColor }}
          >
            <Home className="w-5 h-5 mr-2" />
            Ir a Mi Cuenta
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">¿Necesitas ayuda?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="tel:+50312345678" className="text-blue-600 hover:underline flex items-center">
              <Phone className="w-4 h-4 mr-1" />
              +503 1234-5678
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a href="mailto:reservaciones@hotel.com" className="text-blue-600 hover:underline flex items-center">
              <Mail className="w-4 h-4 mr-1" />
              reservaciones@hotel.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}