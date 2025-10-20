import React, { useState, useEffect } from 'react';
import api from '../lib/api';

interface IVariable {
  name: string;
  type: string;
  defaultValue: any;
}

interface IPosition {
  x: number;
  y: number;
}

interface ISize {
  w: number;
  h: number;
}

interface IElement {
  type: string;
  content: string;
  position: IPosition;
  size: ISize;
}

interface ITemplate {
  _id: string;
  title: string;
  description: string;
  category: string;
  ageRange: string;
  pdfPath: string;
  variables: IVariable[];
  elements: IElement[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const AdminTable: React.FC = () => {
  const [templates, setTemplates] = useState<ITemplate[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<ITemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [ageRangeFilter, setAgeRangeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, categoryFilter, ageRangeFilter]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await api.get('/templates');
      setTemplates(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des templates');
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(template => template.category === categoryFilter);
    }

    if (ageRangeFilter) {
      filtered = filtered.filter(template => template.ageRange === ageRangeFilter);
    }

    setFilteredTemplates(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) return;

    try {
      await api.delete(`/templates/${id}`);
      setTemplates(templates.filter(template => template._id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du template');
      console.error('Error deleting template:', err);
    }
  };

  const getUniqueCategories = () => {
    return [...new Set(templates.map(template => template.category))];
  };

  const getUniqueAgeRanges = () => {
    return [...new Set(templates.map(template => template.ageRange))];
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des Templates</h1>

      {/* Filtres et recherche */}
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Rechercher par titre ou description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Toutes les catégories</option>
          {getUniqueCategories().map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={ageRangeFilter}
          onChange={(e) => setAgeRangeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Toutes les tranches d'âge</option>
          {getUniqueAgeRanges().map(ageRange => (
            <option key={ageRange} value={ageRange}>{ageRange}</option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tranche d'âge</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créé le</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTemplates.map((template) => (
              <tr key={template._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{template.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.ageRange}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(template.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      // TODO: Implement edit modal/form
                      alert('Fonctionnalité de modification à implémenter');
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(template._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Aucun template trouvé
        </div>
      )}
    </div>
  );
};

export default AdminTable;