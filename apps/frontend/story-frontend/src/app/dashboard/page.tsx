'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useDashboardData } from '../../lib/useDashboardData';
import MetricTile from '../../components/MetricTile';
import ChartWrapper from '../../components/ChartWrapper';
import AdminTable from '../../components/AdminTable';
import { Users, FileText, Target, FileBarChart } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { data, loading, error, refetch } = useDashboardData();

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Erreur: {error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard Administrateur
            </h1>
            {user && (
              <p className="text-gray-600">
                Bienvenue, {user.name} ({user.role})
              </p>
            )}
          </div>

          {/* Métriques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricTile
              title="Utilisateurs"
              total={data.metrics.totalUsers}
              icon={<Users className="h-6 w-6" />}
            />
            <MetricTile
              title="Templates"
              total={data.metrics.totalTemplates}
              icon={<FileText className="h-6 w-6" />}
            />
            <MetricTile
              title="Zones"
              total={data.metrics.totalZones}
              icon={<Target className="h-6 w-6" />}
            />
            <MetricTile
              title="PDFs générés"
              total={data.metrics.totalPdfsGenerated}
              icon={<FileBarChart className="h-6 w-6" />}
            />
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Utilisateurs par rôle
              </h2>
              <ChartWrapper
                type="pie"
                data={data.chartData.usersByRole}
                dataKey="value"
              />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Templates par catégorie
              </h2>
              <ChartWrapper
                type="bar"
                data={data.chartData.templatesByCategory}
                dataKey="value"
                xAxisKey="name"
              />
            </div>
          </div>

          {/* Graphique des tranches d'âge */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Templates par tranche d'âge
            </h2>
            <ChartWrapper
              type="line"
              data={data.chartData.templatesByAgeRange}
              dataKey="value"
              xAxisKey="name"
            />
          </div>

          {/* Table de gestion */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Gestion des Templates
            </h2>
            <AdminTable />
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => router.push('/templates')}
                className="flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FileText className="h-5 w-5 mr-2" />
                Gérer les Templates
              </button>
              <button
                onClick={() => router.push('/users')}
                className="flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Users className="h-5 w-5 mr-2" />
                Gérer les Utilisateurs
              </button>
              <button
                onClick={refetch}
                className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Actualiser les données
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