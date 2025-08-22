'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface RoomCalendarConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  minimumNights: number;
  blockedDates: string[];
  pricePerNight: number;
  cleaningFee: number;
  serviceFee: number;
  showPricing: boolean;
}

interface PreviewRoomCalendarProps {
  config: RoomCalendarConfig;
  deviceView?: 'desktop' | 'mobile';
  isEditor?: boolean;
  theme?: any;
}

export default function PreviewRoomCalendar({ 
  config, 
  deviceView, 
  isEditor = false,
  theme 
}: PreviewRoomCalendarProps) {
  
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (deviceView !== undefined) return deviceView === 'mobile';
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return false;
  });

  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | null>(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (deviceView !== undefined) {
      setIsMobile(deviceView === 'mobile');
      return;
    }
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [deviceView]);

  if (!config.enabled) {
    return null;
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nights = selectedCheckIn && selectedCheckOut 
    ? Math.ceil((selectedCheckOut.getTime() - selectedCheckIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const totalPrice = nights * config.pricePerNight;
  const totalWithFees = totalPrice + config.cleaningFee + config.serviceFee;

  return (
    <div className="container mx-auto px-6 py-8 border-t">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Calendar */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">
            {config.title || 'Select check-in date'}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {config.subtitle || `Minimum stay: ${config.minimumNights} nights`}
          </p>

          <div className="border rounded-xl p-4">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="font-semibold">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-sm">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
              
              {/* Empty cells for days before month starts */}
              {[...Array(getFirstDayOfMonth(currentMonth))].map((_, i) => (
                <div key={`empty-${i}`} className="py-2"></div>
              ))}
              
              {/* Days of the month */}
              {[...Array(getDaysInMonth(currentMonth))].map((_, i) => {
                const day = i + 1;
                const isToday = new Date().getDate() === day && 
                              new Date().getMonth() === currentMonth.getMonth();
                const isPast = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day) < new Date();
                
                return (
                  <button
                    key={day}
                    className={`
                      py-2 rounded hover:bg-gray-100 transition
                      ${isToday ? 'font-semibold' : ''}
                      ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
                      ${selectedCheckIn?.getDate() === day ? 'bg-black text-white' : ''}
                    `}
                    disabled={isPast}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <button className="mt-4 text-sm underline">Clear dates</button>
          </div>
        </div>

      </div>
    </div>
  );
}