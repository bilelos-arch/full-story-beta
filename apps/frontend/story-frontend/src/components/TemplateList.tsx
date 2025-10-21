// apps/frontend/story-frontend/src/components/TemplateList.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTemplates, Template } from '../lib/useTemplates';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import TemplateStatusToggle from './TemplateStatusToggle';

const TemplateList: React.FC = () => {
  const router = useRouter();
  const {
    filteredTemplates,
    loading,
    error,
    filters,
    setFilters,
    updateTemplateStatus,
    deleteTemplate,
    refetch,
  } = useTemplates();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Gestion de la recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  // Gestion des filtres
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? undefined : (e.target.value as 'draft' | 'public');
    setFilters({ ...filters, status: value });
  };

  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? undefined : e.target.value;
    setFilters({ ...filters, category: value });
  };

  const handleAgeRangeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? undefined : e.target.value;
    setFilters({ ...filters, ageRange: value });
  };

  // Gestion des actions CRUD
  const handleEdit = (templateId: string) => {
    router.push(`/editor/${templateId}`);
  };

  const handleDownloadPDF = (pdfPath: string) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${pdfPath}`, '_blank');
  };

  const handleDeleteClick = (template: Template) => {
    setTemplateToDelete(template);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!templateToDelete) return;

    setDeleteLoading(true);
    try {
      await deleteTemplate(templateToDelete._id);
      setDeleteModalOpen(false);
      setTemplateToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (templateId: string, newStatus: 'draft' | 'public') => {
    try {
      await updateTemplateStatus(templateId, newStatus);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Obtenir les valeurs uniques pour les filtres
  const categories = Array.from(new Set(filteredTemplates.map(t => t.category)));
  const ageRanges = Array.from(new Set(filteredTemplates.map(t => t.ageRange)));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Chargement des templates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Recherche
            </label>
            <input
              type="text"
              id="search"
              value={filters.search || ''}
              onChange={handleSearchChange}
              placeholder="Titre ou description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtre statut */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              id="status"
              value={filters.status || 'all'}
              onChange={handleStatusFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous</option>
              <option value="public">Public</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Filtre catégorie */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              id="category"
              value={filters.category || 'all'}
              onChange={handleCategoryFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Filtre âge */}
          <div>
            <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-1">
              Tranche d'âge
            </label>
            <select
              id="ageRange"
              value={filters.ageRange || 'all'}
              onChange={handleAgeRangeFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes</option>
              {ageRanges.map(ageRange => (
                <option key={ageRange} value={ageRange}>{ageRange}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des templates */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {filters.search || filters.status || filters.category || filters.ageRange
              ? 'Aucun template ne correspond aux filtres sélectionnés.'
              : 'Aucun template disponible.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* En-tête avec statut */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {template.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    template.status === 'public'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {template.status === 'public' ? 'Public' : 'Draft'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {template.description}
                </p>

                {/* Métadonnées */}
                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex justify-between">
                    <span><strong>Catégorie:</strong></span>
                    <span>{template.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span><strong>Âge:</strong></span>
                    <span>{template.ageRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span><strong>Créé le:</strong></span>
                    <span>{new Date(template.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span><strong>Par:</strong></span>
                    <span>{template.createdBy.email}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {/* Toggle statut */}
                  <TemplateStatusToggle
                    templateId={template._id}
                    currentStatus={template.status}
                    onStatusChange={(newStatus) => handleStatusChange(template._id, newStatus)}
                  />

                  {/* Boutons d'action */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(template._id)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(template.pdfPath)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => handleDeleteClick(template)}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setTemplateToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        message={`Êtes-vous sûr de vouloir supprimer le template "${templateToDelete?.title}" ? Cette action est irréversible.`}
      />
    </div>
  );
};

export default TemplateList;