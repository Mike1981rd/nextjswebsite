'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header temporal */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Bienvenido, {user?.fullName || user?.email}
              </span>
              <button
                onClick={() => router.push('/login')}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Bienvenido al Panel de Administración
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {/* Card ejemplo - Empresa */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-base font-medium text-gray-900">Empresa</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Configura la información de tu empresa
                  </p>
                  <button
                    onClick={() => router.push('/empresa')}
                    className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Ir a configuración →
                  </button>
                </div>

                {/* Card ejemplo - Productos */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-base font-medium text-gray-900">Productos</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Gestiona tu catálogo de productos
                  </p>
                  <button
                    onClick={() => router.push('/productos')}
                    className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Ver productos →
                  </button>
                </div>

                {/* Card ejemplo - Website Builder */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-base font-medium text-gray-900">Website Builder</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Diseña y personaliza tu sitio web
                  </p>
                  <button
                    onClick={() => router.push('/website-builder')}
                    className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Abrir editor →
                  </button>
                </div>
              </div>

              {/* Información del usuario */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-sm font-medium text-gray-900">Información del usuario</h3>
                <dl className="mt-2 text-sm text-gray-600">
                  <div className="mt-1">
                    <dt className="inline font-medium">Email:</dt>
                    <dd className="inline ml-2">{user?.email}</dd>
                  </div>
                  <div className="mt-1">
                    <dt className="inline font-medium">Nombre:</dt>
                    <dd className="inline ml-2">{user?.fullName}</dd>
                  </div>
                  <div className="mt-1">
                    <dt className="inline font-medium">Rol:</dt>
                    <dd className="inline ml-2">{user?.roles?.join(', ') || 'Sin rol'}</dd>
                  </div>
                  {user?.hotelName && (
                    <div className="mt-1">
                      <dt className="inline font-medium">Empresa:</dt>
                      <dd className="inline ml-2">{user.hotelName}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}