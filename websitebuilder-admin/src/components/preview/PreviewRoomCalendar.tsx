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

        {/* Pricing card */}
        {config.showPricing && (
          <div className="lg:w-96">
            <div className="border rounded-xl p-6 sticky top-6">
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-semibold">${config.pricePerNight}</span>
                <span className="text-gray-600">night</span>
              </div>

              <div className="grid grid-cols-2 gap-px border rounded-lg overflow-hidden mb-4">
                <button className="bg-white p-3 text-left hover:bg-gray-50">
                  <div className="text-xs font-medium">CHECK-IN</div>
                  <div className="text-sm">Add date</div>
                </button>
                <button className="bg-white p-3 text-left hover:bg-gray-50">
                  <div className="text-xs font-medium">CHECKOUT</div>
                  <div className="text-sm">Add date</div>
                </button>
              </div>

              <button className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-medium mb-4">
                Check availability
              </button>

              {nights > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="underline">${config.pricePerNight} x {nights} nights</span>
                    <span>${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="underline">Cleaning fee</span>
                    <span>${config.cleaningFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="underline">Service fee</span>
                    <span>${config.serviceFee}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>${totalWithFees}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}