import { useState, useEffect, useCallback } from 'react';
import api from './api';
import {
  DashboardData,
  DashboardMetrics,
  TemplateStats,
  UserStats,
  ChartData,
  UseDashboardDataReturn,
} from './dashboard-types';

const initialData: DashboardData = {
  metrics: {
    totalUsers: 0,
    totalTemplates: 0,
    totalZones: 0,
    totalPdfsGenerated: 0,
  },
  templateStats: {
    byCategory: [],
    byAgeRange: [],
    recentTemplates: 0,
  },
  userStats: {
    byRole: [],
    recentUsers: 0,
  },
  chartData: {
    usersByRole: [],
    templatesByCategory: [],
    templatesByAgeRange: [],
  },
  loading: true,
  error: null,
};

export function useDashboardData(): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Début récupération données dashboard');

      // Récupérer toutes les données en parallèle
      console.log('Appels API parallèles: users, templates, pdfs');
      const [usersResponse, templatesResponse, pdfsResponse] = await Promise.all([
        api.get('/users'),
        api.get('/templates'),
        api.get('/pdf/generated').catch(() => ({ data: [] })), // Simuler une liste de PDFs générés
      ]);
      console.log('Réponses reçues:', {
        users: usersResponse.data.length,
        templates: templatesResponse.data.length,
        pdfs: pdfsResponse.data.length
      });

      const users = usersResponse.data;
      const templates = templatesResponse.data;
      const pdfs = pdfsResponse.data || [];

      // Récupérer les zones pour chaque template
      const zonesPromises = templates.map((template: any) =>
        api.get(`/zones/${template._id}`).catch(() => ({ data: [] })) // Retourner un tableau vide si erreur
      );
      const zonesResponses = await Promise.all(zonesPromises);
      const zones = zonesResponses.flatMap(response => response.data);

      // Calculer les métriques
      const metrics: DashboardMetrics = {
        totalUsers: users.length,
        totalTemplates: templates.length,
        totalZones: zones.length,
        totalPdfsGenerated: pdfs.length, // Nombre de PDFs générés
      };

      // Statistiques des templates
      const templateStats: TemplateStats = {
        byCategory: calculateCategoryStats(templates),
        byAgeRange: calculateAgeRangeStats(templates),
        recentTemplates: templates.filter((t: any) =>
          new Date(t.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
      };

      // Statistiques des utilisateurs
      const userStats: UserStats = {
        byRole: calculateRoleStats(users),
        recentUsers: users.filter((u: any) =>
          new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
      };

      // Statistiques des PDFs
      const pdfStats = {
        recentPdfs: pdfs.filter((pdf: any) =>
          new Date(pdf.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
        totalPdfs: pdfs.length,
      };

      // Données pour les graphiques
      const chartData = {
        usersByRole: calculateRoleStats(users),
        templatesByCategory: calculateCategoryStats(templates),
        templatesByAgeRange: calculateAgeRangeStats(templates),
        pdfsByMonth: calculatePdfStatsByMonth(pdfs), // Graphique des PDFs par mois
      };
      console.log('Données calculées:', {
        metrics,
        chartDataKeys: Object.keys(chartData),
        pdfsCount: pdfs.length
      });

      setData({
        metrics,
        templateStats,
        userStats,
        pdfStats,
        chartData,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      console.error('Erreur lors du chargement des données du dashboard:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des données');
      setData(prev => ({ ...prev, loading: false, error: err.response?.data?.message || 'Erreur lors du chargement des données' }));
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    refetch,
    loading,
    error,
  };
}

// Fonctions utilitaires pour calculer les statistiques
function calculateCategoryStats(templates: any[]): ChartData[] {
  const categoryCount: { [key: string]: number } = {};

  templates.forEach(template => {
    const category = template.category || 'Non catégorisé';
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });

  return Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value,
  }));
}

function calculateAgeRangeStats(templates: any[]): ChartData[] {
  const ageRangeCount: { [key: string]: number } = {};

  templates.forEach(template => {
    const ageRange = template.ageRange || 'Non spécifié';
    ageRangeCount[ageRange] = (ageRangeCount[ageRange] || 0) + 1;
  });

  return Object.entries(ageRangeCount).map(([name, value]) => ({
    name,
    value,
  }));
}

function calculateRoleStats(users: any[]): ChartData[] {
  const roleCount: { [key: string]: number } = {};

  users.forEach(user => {
    const role = user.role || 'user';
    roleCount[role] = (roleCount[role] || 0) + 1;
  });

  return Object.entries(roleCount).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));
}

function calculatePdfStatsByMonth(pdfs: any[]): ChartData[] {
  const monthCount: { [key: string]: number } = {};

  pdfs.forEach(pdf => {
    const date = new Date(pdf.createdAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthCount[monthKey] = (monthCount[monthKey] || 0) + 1;
  });

  return Object.entries(monthCount)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => ({
      name,
      value,
    }));
}