'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useI18n } from '@/contexts/I18nContext';
import {
  DashboardIcon,
  CompanyIcon,
  UsersIcon,
  RolesIcon,
  ClientsIcon,
  RoomsIcon,
  ReservationsIcon,
  ProductsIcon,
  CollectionsIcon,
  PagesIcon,
  WebsiteIcon,
  PaymentIcon,
  DomainsIcon,
  PoliciesIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@/components/ui/Icons';

// Define menu items with translation keys
const menuItems = [
  {
    id: 'dashboard',
    nameKey: 'navigation.dashboard',
    href: '/dashboard',
    icon: DashboardIcon,
    permission: 'dashboard.view'
  },
  {
    id: 'empresa',
    nameKey: 'navigation.empresa',
    href: '/dashboard/empresa',
    icon: CompanyIcon,
    permission: 'company.view'
  },
  {
    id: 'usuarios',
    nameKey: 'navigation.rolesUsuarios',
    href: '/usuarios',
    icon: UsersIcon,
    permission: 'users.view'
  },
  {
    id: 'roles',
    nameKey: 'navigation.rolesUsuarios',
    href: '/roles',
    icon: RolesIcon,
    permission: 'roles.view'
  },
  {
    id: 'clientes',
    nameKey: 'navigation.clientes',
    href: '/clientes',
    icon: ClientsIcon,
    permission: 'clients.view'
  },
  {
    id: 'habitaciones',
    nameKey: 'navigation.reservaciones',
    href: '/habitaciones',
    icon: RoomsIcon,
    permission: 'rooms.view'
  },
  {
    id: 'reservaciones',
    nameKey: 'navigation.reservaciones',
    href: '/reservaciones',
    icon: ReservationsIcon,
    permission: 'reservations.view'
  },
  {
    id: 'productos',
    nameKey: 'navigation.productos',
    href: '/productos',
    icon: ProductsIcon,
    permission: 'products.view'
  },
  {
    id: 'colecciones',
    nameKey: 'navigation.colecciones',
    href: '/colecciones',
    icon: CollectionsIcon,
    permission: 'collections.view'
  },
  {
    id: 'paginas',
    nameKey: 'navigation.paginas',
    href: '/paginas',
    icon: PagesIcon,
    permission: 'pages.view'
  },
  {
    id: 'sitio-web',
    nameKey: 'navigation.websiteBuilder',
    href: '/sitio-web',
    icon: WebsiteIcon,
    permission: 'website.view'
  },
  {
    id: 'metodos-pago',
    nameKey: 'navigation.metodosPago',
    href: '/metodos-pago',
    icon: PaymentIcon,
    permission: 'payments.view'
  },
  {
    id: 'dominios',
    nameKey: 'navigation.dominios',
    href: '/dominios',
    icon: DomainsIcon,
    permission: 'domains.view'
  },
  {
    id: 'politicas',
    nameKey: 'navigation.politicas',
    href: '/politicas',
    icon: PoliciesIcon,
    permission: 'policies.view'
  }
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function Sidebar({ collapsed = false, onToggle, className }: SidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { t } = useI18n();
  
  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Check if user has permission (placeholder - integrate with actual auth)
  const hasPermission = (permission: string) => {
    // TODO: Integrate with actual auth context
    return true;
  };

  // Filter menu items based on permissions
  const visibleMenuItems = menuItems.filter(item => hasPermission(item.permission));

  // Debug log (cleaned up)
  // console.log('Sidebar collapsed state:', collapsed);
  // console.log('Visible menu items count:', visibleMenuItems.length);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen shadow-sidebar transition-all duration-300 ease-in-out',
          collapsed ? 'w-20' : 'w-72',
          'hidden md:block',
          className
        )}
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)',
          width: collapsed ? '80px' : '320px', // Better width for collapsed state
          minWidth: collapsed ? '80px' : '320px', // Ensure minimum width
          maxWidth: collapsed ? '80px' : '320px'  // Ensure maximum width
        }}
      >
        {/* Logo and Toggle */}
        <div className={cn(
          "flex h-16 items-center justify-between transition-all duration-300",
          collapsed ? "px-3" : "px-4"
        )}>
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-bold text-sm">
              WB
            </div>
            
            {/* Brand Name */}
            {!collapsed && (
              <span className="font-semibold text-lg text-sidebar-text transition-opacity duration-300">
                WebsiteBuilder
              </span>
            )}
          </div>

          {/* Toggle Button */}
          {!collapsed && (
            <button
              onClick={onToggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-bgHover text-sidebar-text hover:bg-sidebar-active transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeftIcon size={16} />
            </button>
          )}
          
          {collapsed && (
            <button
              onClick={onToggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-bgHover text-sidebar-text hover:bg-sidebar-active transition-colors"
              title="Expand sidebar"
            >
              <ChevronRightIcon size={16} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className={cn(
          "py-6 overflow-y-auto sidebar-scroll transition-all duration-300",
          collapsed ? "px-2" : "px-4"
        )} style={{ height: 'calc(100vh - 64px - 80px)' }}>
          <ul className="space-y-2">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              // More specific active check to avoid false positives
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href + '/')) ||
                (item.href === '/dashboard' && pathname === '/dashboard');

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center rounded-lg py-2.5 text-sm font-medium transition-all duration-200 group relative',
                      collapsed ? 'justify-center px-0' : 'gap-3 px-3',
                      isActive
                        ? 'bg-sidebar-active text-white shadow-lg'
                        : 'text-sidebar-textSecondary hover:bg-sidebar-bgHover hover:text-sidebar-text'
                    )}
                    title={collapsed ? t(item.nameKey) : undefined}
                  >
                    {/* Icon */}
                    <Icon
                      size={20}
                      className={cn(
                        'flex-shrink-0 transition-colors',
                        isActive ? 'text-white' : 'text-sidebar-textSecondary group-hover:text-sidebar-text'
                      )}
                    />

                    {/* Label */}
                    {!collapsed && (
                      <span className="flex-1 truncate">
                        {t(item.nameKey)}
                      </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div className="absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-3 py-2 text-xs text-white opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100 pointer-events-none">
                        {t(item.nameKey)}
                        <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-800"></div>
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-bgHover p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-semibold">
              WB
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs text-sidebar-text font-medium truncate">
                  Website Builder
                </p>
                <p className="text-xs text-sidebar-textSecondary truncate">
                  v2.0.0
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden',
          collapsed ? 'invisible opacity-0' : 'visible opacity-100'
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 transition-opacity"
          onClick={onToggle}
        />

        {/* Mobile Sidebar */}
        <aside
          className={cn(
            'absolute left-0 top-0 h-full w-sidebar shadow-xl transition-transform duration-300',
            collapsed ? '-translate-x-full' : 'translate-x-0'
          )}
          style={{
            backgroundColor: 'var(--sidebar-bg)',
            color: 'var(--sidebar-text)'
          }}
        >
          {/* Mobile Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-bgHover">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-bold text-sm">
                WB
              </div>
              <span className="font-semibold text-lg text-sidebar-text">
                WebsiteBuilder
              </span>
            </div>

            <button
              onClick={onToggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-bgHover text-sidebar-text hover:bg-sidebar-active transition-colors"
              title="Close sidebar"
            >
              <ChevronLeftIcon size={16} />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="px-4 py-6 overflow-y-auto sidebar-scroll" style={{ height: 'calc(100vh - 64px - 80px)' }}>
            <ul className="space-y-2">
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                // More specific active check to avoid false positives
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href + '/')) ||
                  (item.href === '/dashboard' && pathname === '/dashboard');

                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={onToggle} // Close mobile sidebar on navigation
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-sidebar-active text-white shadow-lg'
                          : 'text-sidebar-textSecondary hover:bg-sidebar-bgHover hover:text-sidebar-text'
                      )}
                    >
                      <Icon
                        size={20}
                        className={cn(
                          'flex-shrink-0 transition-colors',
                          isActive ? 'text-white' : 'text-sidebar-textSecondary'
                        )}
                      />
                      <span className="flex-1 truncate">
                        {t(item.nameKey)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
}