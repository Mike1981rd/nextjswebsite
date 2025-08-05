'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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

// Define menu items with our 14 options
const menuItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    icon: DashboardIcon,
    permission: 'dashboard.view'
  },
  {
    id: 'empresa',
    name: 'Empresa',
    href: '/empresa',
    icon: CompanyIcon,
    permission: 'company.view'
  },
  {
    id: 'usuarios',
    name: 'Usuarios',
    href: '/usuarios',
    icon: UsersIcon,
    permission: 'users.view'
  },
  {
    id: 'roles',
    name: 'Roles',
    href: '/roles',
    icon: RolesIcon,
    permission: 'roles.view'
  },
  {
    id: 'clientes',
    name: 'Clientes',
    href: '/clientes',
    icon: ClientsIcon,
    permission: 'clients.view'
  },
  {
    id: 'habitaciones',
    name: 'Habitaciones',
    href: '/habitaciones',
    icon: RoomsIcon,
    permission: 'rooms.view'
  },
  {
    id: 'reservaciones',
    name: 'Reservaciones',
    href: '/reservaciones',
    icon: ReservationsIcon,
    permission: 'reservations.view'
  },
  {
    id: 'productos',
    name: 'Productos',
    href: '/productos',
    icon: ProductsIcon,
    permission: 'products.view'
  },
  {
    id: 'colecciones',
    name: 'Colecciones',
    href: '/colecciones',
    icon: CollectionsIcon,
    permission: 'collections.view'
  },
  {
    id: 'paginas',
    name: 'Páginas',
    href: '/paginas',
    icon: PagesIcon,
    permission: 'pages.view'
  },
  {
    id: 'sitio-web',
    name: 'Sitio Web',
    href: '/sitio-web',
    icon: WebsiteIcon,
    permission: 'website.view'
  },
  {
    id: 'metodos-pago',
    name: 'Métodos de Pago',
    href: '/metodos-pago',
    icon: PaymentIcon,
    permission: 'payments.view'
  },
  {
    id: 'dominios',
    name: 'Dominios',
    href: '/dominios',
    icon: DomainsIcon,
    permission: 'domains.view'
  },
  {
    id: 'politicas',
    name: 'Políticas',
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

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen shadow-sidebar transition-all duration-300 ease-in-out',
          collapsed ? 'w-sidebar-collapsed' : 'w-sidebar',
          'hidden md:block',
          className
        )}
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          color: 'var(--sidebar-text)'
        }}
      >
        {/* Logo and Toggle */}
        <div className="flex h-navbar items-center justify-between px-4">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-bold text-sm">
              WB
            </div>
            
            {/* Brand Name */}
            {!collapsed && (
              <span className="font-semibold text-lg text-sidebar-text">
                WebsiteBuilder
              </span>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-bgHover text-sidebar-text hover:bg-sidebar-active transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRightIcon size={16} />
            ) : (
              <ChevronLeftIcon size={16} />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative',
                      isActive
                        ? 'bg-sidebar-active text-white shadow-lg'
                        : 'text-sidebar-textSecondary hover:bg-sidebar-bgHover hover:text-sidebar-text'
                    )}
                    title={collapsed ? item.name : undefined}
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
                        {item.name}
                      </span>
                    )}

                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div className="absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 pointer-events-none">
                        {item.name}
                        <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-gray-900"></div>
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
          <div className="flex h-navbar items-center justify-between px-4 border-b border-sidebar-bgHover">
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
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {visibleMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

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
                        {item.name}
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