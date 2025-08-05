import React from 'react';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { WeeklySales } from '@/components/dashboard/WeeklySales';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { MiniMetricCard } from '@/components/ui/MetricCard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Sales Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Total 42.5k Sales +18% from yesterday
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option>Últimos 7 días</option>
            <option>Últimos 30 días</option>
            <option>Últimos 3 meses</option>
          </select>
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
            Exportar
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <StatsGrid />

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Weekly Sales Chart */}
        <div className="xl:col-span-1">
          <WeeklySales />
        </div>

        {/* Total Visits Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">$42.5k</div>
              <div className="flex items-center justify-center gap-1 text-success-500 text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                +8.45%
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Mobile</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">23.5%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">2,890</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Desktop</span>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900 dark:text-white">76.5%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">22,465</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sessions</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Month</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">12.2k</div>
                <div className="text-success-500 text-sm font-medium">-25.5%</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Sessions last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <ActivityTimeline />

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referral Sources</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">Number of Sales</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Samsung s22', image: '📱', status: 'Out of Stock', revenue: '$12.5k', profit: '+24%', profitColor: 'text-success-500' },
                { name: 'iPhone 14 Pro', image: '📱', status: 'In Stock', revenue: '$45k', profit: '-18%', profitColor: 'text-error-500' },
                { name: 'Oneplus 9 Pro', image: '📱', status: 'Upcoming', revenue: '$98.2k', profit: '+55%', profitColor: 'text-success-500' },
                { name: 'Google Pixel 6', image: '📱', status: 'In Stock', revenue: '$210k', profit: '+8%', profitColor: 'text-success-500' },
              ].map((product, index) => (
                <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                    {product.image}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                    <div className={`text-sm ${
                      product.status === 'Out of Stock' ? 'text-error-500' :
                      product.status === 'Upcoming' ? 'text-warning-500' :
                      'text-success-500'
                    }`}>
                      {product.status}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">{product.revenue}</div>
                    <div className={`text-sm font-medium ${product.profitColor}`}>
                      {product.profit}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Visitors and Marketing Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Marketing & Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Marketing & Sales</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total 245.8k Sales +25%</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Circular progress */}
              <div className="flex items-center justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                    <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle cx="48" cy="48" r="40" stroke="#6366f1" strokeWidth="8" strokeDasharray="251" strokeDashoffset="60" fill="none" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">84k</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Impression</div>
                <div className="text-error-500 text-sm font-medium">-24%</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Sales Overview</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">68</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Open</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Conversions</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">52</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Converted</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Total Orders</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">04</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Lost</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Revenue</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">12</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Quotations</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Details
                </button>
                <button className="flex-1 py-2 px-4 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600">
                  Report
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Visitors */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Visitors</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Total 890 Visitors Are Live</p>
              </div>
              <div className="flex items-center gap-1 text-success-500 text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                +78.2%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Bar chart representation */}
            <div className="h-48 flex items-end gap-2">
              {[20, 45, 65, 80, 35, 90, 55, 75, 40, 85, 60, 95, 70, 50, 88, 45, 75, 65].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-success-500 rounded-t transition-all hover:bg-success-600"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="mt-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Visits by Day</div>
                <div className="font-semibold text-gray-900 dark:text-white">Total 248.5k Visits on Thursday</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}