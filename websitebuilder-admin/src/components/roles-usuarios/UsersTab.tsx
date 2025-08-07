'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/contexts/I18nContext';
import { 
  SearchIcon, 
  FilterIcon, 
  DownloadIcon, 
  PlusIcon, 
  CopyIcon, 
  EyeIcon, 
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  UserPlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  companyId?: number;
  isActive: boolean;
  emailConfirmed: boolean;
  lastLoginAt?: string;
  createdAt: string;
  roles: Role[];
  plan?: string;
  avatarUrl?: string;
}

interface Role {
  id: number;
  name: string;
}

interface UsersTabProps {
  primaryColor: string;
}

export function UsersTab({ primaryColor }: UsersTabProps) {
  const router = useRouter();
  const { t } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5266/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Error fetching users:', response.status);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    router.push(`/dashboard/roles-usuarios/users/${user.id}/edit`);
  };

  const handleView = (user: User) => {
    router.push(`/dashboard/roles-usuarios/users/${user.id}/edit`);
  };

  const handleDelete = async (userId: number) => {
    if (!confirm(t('rolesUsers.confirmDeleteUser', 'Are you sure you want to delete this user?'))) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5266/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchUsers();
      } else {
        alert(t('rolesUsers.deleteUserError', 'Error deleting user'));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(t('rolesUsers.deleteUserError', 'Error deleting user'));
    }
  };


  const getRoleColor = (roleName: string) => {
    const colors: { [key: string]: string } = {
      'Maintainer': '#10b981',
      'Subscriber': '#8b5cf6',
      'Editor': '#06b6d4',
      'Admin': '#ef4444',
      'Author': '#f59e0b',
      'SuperAdmin': '#ef4444',
      'CompanyAdmin': '#8b5cf6',
      'CompanyStaff': '#10b981',
      'Customer': '#6b7280'
    };
    return colors[roleName] || '#6b7280';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? '#10b981' : '#6b7280';
  };

  const getPlanBadgeColor = (plan: string) => {
    const colors: { [key: string]: string } = {
      'Enterprise': '#8b5cf6',
      'Basic': '#6b7280',
      'Team': '#3b82f6',
      'Company': '#f59e0b'
    };
    return colors[plan] || '#6b7280';
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || user.roles.some(r => r.name === selectedRole);
    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u.id));
    }
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting users...');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: primaryColor }}></div>
      </div>
    );
  }

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const paidUsers = users.filter(u => u.plan && u.plan !== 'Basic').length;
  const pendingUsers = users.filter(u => !u.emailConfirmed).length;

  // Get sessions count (mock data for now)
  const sessionsCount = 21459;
  const sessionsChange = 29;

  return (
    <div>
      {/* Statistics Cards - Mobile Optimized */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Sessions Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t('rolesUsers.sessions', 'Sessions')}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sessionsCount.toLocaleString()}
                </h3>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  +{sessionsChange}%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {t('rolesUsers.lastWeek', 'Last week analytics')}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Paid Users Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t('rolesUsers.paidUsers', 'Paid Users')}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {paidUsers.toLocaleString()}
                </h3>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  +18%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {t('rolesUsers.lastWeek', 'Last week analytics')}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t('rolesUsers.activeUsers', 'Active Users')}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeUsers.toLocaleString()}
                </h3>
                <span className="text-xs font-medium text-red-600 dark:text-red-400">
                  -14%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {t('rolesUsers.lastWeek', 'Last week analytics')}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Users Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {t('rolesUsers.pendingUsers', 'Pending Users')}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingUsers.toLocaleString()}
                </h3>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  +42%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {t('rolesUsers.lastWeek', 'Last week analytics')}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel - Mobile Optimized */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {t('rolesUsers.filters', 'Filters')}
        </h3>
        
        <div className="space-y-3">
          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': primaryColor } as any}
            >
              <option value="">{t('rolesUsers.selectRole', 'Select Role')}</option>
              <option value="SuperAdmin">SuperAdmin</option>
              <option value="CompanyAdmin">CompanyAdmin</option>
              <option value="CompanyStaff">CompanyStaff</option>
              <option value="Customer">Customer</option>
            </select>

            {/* Plan Filter */}
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': primaryColor } as any}
            >
              <option value="">{t('rolesUsers.selectPlan', 'Select Plan')}</option>
              <option value="Basic">Basic</option>
              <option value="Team">Team</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Company">Company</option>
            </select>

            {/* Status Filter */}
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': primaryColor } as any}
            >
              <option value="">{t('rolesUsers.selectStatus', 'Select Status')}</option>
              <option value="active">{t('common.active', 'Active')}</option>
              <option value="inactive">{t('common.inactive', 'Inactive')}</option>
              <option value="pending">{t('common.pending', 'Pending')}</option>
            </select>
          </div>

          {/* Items per page and Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Items per page */}
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': primaryColor } as any}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            {/* Search with Button */}
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t('common.searchUser', 'Search User')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 placeholder-gray-400 dark:placeholder-gray-500"
                  style={{ '--tw-ring-color': primaryColor } as any}
                />
              </div>
              <button
                className="px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                style={{ backgroundColor: primaryColor }}
              >
                <SearchIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{t('common.search', 'Search')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users List - Mobile Cards / Desktop Table */}
      {/* Mobile Cards View */}
      <div className="sm:hidden space-y-3 mb-6">
        {paginatedUsers.map((user) => (
          <div key={user.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              {user.avatarUrl ? (
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img 
                    src={user.avatarUrl} 
                    alt={user.fullName} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                            ${user.firstName.charAt(0)}${user.lastName.charAt(0)}
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
              )}
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                  
                  {/* Actions Dropdown */}
                  <div className="relative group">
                    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      <MoreVerticalIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all z-10">
                      <button
                        onClick={() => handleEdit(user)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <EditIcon className="w-4 h-4" />
                        {t('common.edit', 'Edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <TrashIcon className="w-4 h-4" />
                        {t('common.delete', 'Delete')}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Role Badge */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.roles.map((role) => (
                    <span
                      key={role.id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${getRoleColor(role.name)}20`,
                        color: getRoleColor(role.name)
                      }}
                    >
                      {role.name}
                    </span>
                  ))}
                </div>
                
                {/* Additional Info */}
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                  <span>{user.plan || 'Basic'}</span>
                  <span>•</span>
                  <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="p-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 dark:border-gray-600"
                  style={{ accentColor: primaryColor }}
                />
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                {t('rolesUsers.user', 'User')}
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                {t('rolesUsers.email', 'Email')}
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                {t('rolesUsers.role', 'Role')}
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                {t('rolesUsers.plan', 'Plan')}
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                {t('rolesUsers.status', 'Status')}
              </th>
              <th className="p-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                {t('rolesUsers.actions', 'Actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                    className="rounded border-gray-300 dark:border-gray-600"
                    style={{ accentColor: primaryColor }}
                  />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {user.avatarUrl ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img 
                          src={user.avatarUrl} 
                          alt={user.fullName} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const parent = e.currentTarget.parentElement?.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                                  ${user.firstName.charAt(0)}${user.lastName.charAt(0)}
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        @{user.email.split('@')[0]}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </p>
                </td>
                <td className="p-3">
                  {user.roles.map((role) => (
                    <span
                      key={role.id}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${getRoleColor(role.name)}20`,
                        color: getRoleColor(role.name)
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getRoleColor(role.name) }} />
                      {role.name}
                    </span>
                  ))}
                </td>
                <td className="p-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.plan || 'Basic'}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className="inline-flex px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: user.isActive ? '#10b98120' : '#6b728020',
                      color: user.isActive ? '#10b981' : '#6b7280'
                    }}
                  >
                    {user.isActive ? t('common.active', 'Active') : t('common.inactive', 'Inactive')}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(user.email)}
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      title={t('common.copy', 'Copy')}
                    >
                      <CopyIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleView(user)}
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      title={t('common.view', 'View')}
                    >
                      <EyeIcon className="w-4 h-4 text-gray-500" />
                    </button>
                    <div className="relative group">
                      <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreVerticalIcon className="w-4 h-4 text-gray-500" />
                      </button>
                      <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => handleEdit(user)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <EditIcon className="w-4 h-4" />
                          {t('common.edit', 'Edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <TrashIcon className="w-4 h-4" />
                          {t('common.delete', 'Delete')}
                        </button>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col items-center gap-4">
        {/* Mobile Pagination */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          
          {[...Array(Math.min(3, totalPages))].map((_, i) => {
            const pageNum = currentPage > 2 ? currentPage - 1 + i : i + 1;
            if (pageNum > totalPages) return null;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === pageNum
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                style={{
                  backgroundColor: currentPage === pageNum ? primaryColor : 'transparent'
                }}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Desktop Pagination */}
        <div className="hidden sm:flex sm:flex-row items-center justify-between w-full">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('common.showing', 'Showing')} {(currentPage - 1) * itemsPerPage + 1} {t('common.to', 'to')} {Math.min(currentPage * itemsPerPage, filteredUsers.length)} {t('common.of', 'of')} {filteredUsers.length} {t('common.entries', 'entries')}
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-lg ${
                    currentPage === pageNum
                      ? 'text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  style={{
                    backgroundColor: currentPage === pageNum ? primaryColor : 'transparent'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button - Mobile Only */}
      <button
        onClick={() => router.push('/dashboard/roles-usuarios/users/new')}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all transform hover:scale-110"
        aria-label={t('rolesUsers.newUser', 'New User')}
      >
        <PlusIcon className="w-6 h-6" />
      </button>
    </div>
  );
}