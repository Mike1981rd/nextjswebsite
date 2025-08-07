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

  return (
    <div>
      {/* Header Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {t('rolesUsers.totalUsersWithRoles', 'Total users with their roles')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('rolesUsers.usersDescription', "Find all of your company's administrator accounts and their associate roles.")}
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Items per page */}
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': primaryColor } as any}
        >
          <option value={10}>Show 10</option>
          <option value={25}>Show 25</option>
          <option value={50}>Show 50</option>
        </select>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <DownloadIcon className="w-4 h-4" />
          {t('common.export', 'Export')}
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('common.searchUser', 'Search User')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 w-full sm:w-64"
            style={{ '--tw-ring-color': primaryColor } as any}
          />
        </div>

        {/* Role Filter */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': primaryColor } as any}
        >
          <option value="">Select Role</option>
          <option value="SuperAdmin">SuperAdmin</option>
          <option value="CompanyAdmin">CompanyAdmin</option>
          <option value="CompanyStaff">CompanyStaff</option>
          <option value="Customer">Customer</option>
        </select>

        {/* Add User Button */}
        <button
          onClick={() => router.push('/dashboard/roles-usuarios/users/new')}
          className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
          style={{ backgroundColor: primaryColor }}
        >
          <UserPlusIcon className="w-4 h-4" />
          <span className="hidden sm:inline">{t('rolesUsers.addUser', 'Add User')}</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
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
                            // If image fails to load, hide it and show fallback
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
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('common.showing', 'Showing')} {(currentPage - 1) * itemsPerPage + 1} {t('common.to', 'to')} {Math.min(currentPage * itemsPerPage, filteredUsers.length)} {t('common.of', 'of')} {filteredUsers.length} {t('common.entries', 'entries')}
        </p>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="w-4 h-4" />
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
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}