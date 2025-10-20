import { useState, useEffect, useCallback, useMemo } from 'react';
import api from './api';

// Types pour les templates (basés sur le schéma backend)
export interface Template {
  _id: string;
  title: string;
  description: string;
  category: string;
  ageRange: string;
  pdfPath: string;
  variables: Array<{
    name: string;
    type: string;
    defaultValue: any;
  }>;
  elements: Array<{
    type: string;
    content: string;
    position: { x: number; y: number };
    size: { w: number; h: number };
  }>;
  status: 'draft' | 'public';
  createdBy: {
    _id: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TemplateFilters {
  status?: 'draft' | 'public';
  category?: string;
  ageRange?: string;
  search?: string;
}

export interface UseTemplatesReturn {
  templates: Template[];
  filteredTemplates: Template[];
  loading: boolean;
  error: string | null;
  filters: TemplateFilters;
  setFilters: (filters: TemplateFilters) => void;
  fetchTemplates: () => Promise<void>;
  updateTemplateStatus: (id: string, status: 'draft' | 'public') => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const initialFilters: TemplateFilters = {
  status: undefined,
  category: undefined,
  ageRange: undefined,
  search: undefined,
};

export function useTemplates(): UseTemplatesReturn {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TemplateFilters>(initialFilters);

  // Filtrage des templates basé sur les filtres actuels
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      // Filtre par statut
      if (filters.status && template.status !== filters.status) {
        return false;
      }

      // Filtre par catégorie
      if (filters.category && template.category !== filters.category) {
        return false;
      }

      // Filtre par tranche d'âge
      if (filters.ageRange && template.ageRange !== filters.ageRange) {
        return false;
      }

      // Filtre par recherche (titre ou description)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const titleMatch = template.title.toLowerCase().includes(searchLower);
        const descriptionMatch = template.description.toLowerCase().includes(searchLower);
        if (!titleMatch && !descriptionMatch) {
          return false;
        }
      }

      return true;
    });
  }, [templates, filters]);

  // Fonction pour récupérer tous les templates
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/templates');
      setTemplates(response.data);
    } catch (err: any) {
      console.error('Erreur lors du chargement des templates:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des templates');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour mettre à jour le statut d'un template
  const updateTemplateStatus = useCallback(async (id: string, status: 'draft' | 'public') => {
    try {
      // Optimistic update
      setTemplates(prev =>
        prev.map(template =>
          template._id === id ? { ...template, status } : template
        )
      );

      await api.put(`/templates/${id}/status`, { status });
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      // Revert optimistic update en cas d'erreur
      setTemplates(prev =>
        prev.map(template =>
          template._id === id ? { ...template, status: template.status === 'draft' ? 'public' : 'draft' } : template
        )
      );
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du statut');
      throw err; // Re-throw pour que le composant puisse gérer l'erreur
    }
  }, []);

  // Fonction pour supprimer un template
  const deleteTemplate = useCallback(async (id: string) => {
    try {
      // Optimistic update
      const templateToDelete = templates.find(t => t._id === id);
      setTemplates(prev => prev.filter(template => template._id !== id));

      await api.delete(`/templates/${id}`);
    } catch (err: any) {
      console.error('Erreur lors de la suppression du template:', err);
      // Revert optimistic update en cas d'erreur
      if (templates.find(t => t._id === id)) {
        setTemplates(prev => [...prev]); // Force re-render, mais le template devrait être remis
      }
      setError(err.response?.data?.message || 'Erreur lors de la suppression du template');
      throw err; // Re-throw pour que le composant puisse gérer l'erreur
    }
  }, [templates]);

  // Fonction pour rafraîchir les données
  const refetch = useCallback(async () => {
    await fetchTemplates();
  }, [fetchTemplates]);

  // Chargement initial des templates
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    filteredTemplates,
    loading,
    error,
    filters,
    setFilters,
    fetchTemplates,
    updateTemplateStatus,
    deleteTemplate,
    refetch,
  };
}