'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import ProtectedRoute from '../../components/ProtectedRoute';
import UsersTable from '../../components/UsersTable';
import { ArrowLeft } from 'lucide-react';

export default function UsersPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Gestion des Utilisateurs
                </h1>
                {user && (
                  <p className="text-gray-600">
                    Bienvenue, {user.name} ({user.role})
                  </p>
                )}
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour au Dashboard
              </button>
            </div>
          </div>

          {/* Composant principal UsersTable qui inclut tous les composants nécessaires */}
          <UsersTable />

          {/* Actions supplémentaires */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Retour au Dashboard
              </button>
              <button
                onClick={() => router.push('/templates')}
                className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Gérer les Templates
              </button>
              <button
                onClick={logout}
                className="flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}