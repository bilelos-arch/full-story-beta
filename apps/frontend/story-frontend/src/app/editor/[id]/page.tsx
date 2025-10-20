'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import api from '../../../lib/api';
import ProtectedRoute from '../../../components/ProtectedRoute';
import EditorCanvas from '../../../components/EditorCanvas';
import ElementSidebar from '../../../components/ElementSidebar';
import PropertiesSidebar from '../../../components/PropertiesSidebar';
import { useTemplateEditor } from '../../../lib/useTemplateEditor';

interface Variable {
  name: string;
  type: string;
  defaultValue: any;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  w: number;
  h: number;
}

interface Element {
  type: string;
  content: string;
  position: Position;
  size: Size;
}

interface Template {
  _id: string;
  title: string;
  description: string;
  category: string;
  ageRange: string;
  pdfPath: string;
  variables: Variable[];
  elements: Element[];
  createdAt: string;
  updatedAt: string;
}

export default function EditorPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    template,
    loading,
    saving,
    error,
    selectedElement,
    loadTemplate,
    saveTemplate,
    updateTemplateField,
    addVariable,
    updateVariable,
    removeVariable,
    addElement,
    updateElement,
    removeElement,
    selectElement,
    deselectElement,
    setCurrentPdfPage,
    currentPdfPage,
  } = useTemplateEditor();

  // État pour les zones (pour l'instant vide, à connecter plus tard)
  const [zones, setZones] = useState<any[]>([]);
  const [selectedZone, setSelectedZone] = useState<any>(null);

  const handleAddZone = (zone: any) => {
    // TODO: Implémenter l'ajout de zone
    console.log('Add zone:', zone);
  };

  const handleUpdateZone = (id: string, updates: any) => {
    // TODO: Implémenter la mise à jour de zone
    console.log('Update zone:', id, updates);
  };

  const handleDeleteZone = (id: string) => {
    // TODO: Implémenter la suppression de zone
    console.log('Delete zone:', id);
  };

  useEffect(() => {
    loadTemplate(id);
  }, [id, loadTemplate]);

  const handleSave = async () => {
    try {
      await saveTemplate();
      alert('Template mis à jour avec succès');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  // Protection is handled by ProtectedRoute wrapper

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Éditeur de Template</h1>
          <div className="text-center">Chargement...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Éditeur de Template</h1>
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Éditeur de Template</h1>
          <div className="text-center text-gray-500">Template non trouvé</div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Éditeur de Template</h1>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/templates')}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Retour aux Templates
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>

          {/* Formulaire d'informations générales */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Informations générales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={template.title}
                  onChange={(e) => updateTemplateField('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <input
                  type="text"
                  value={template.category}
                  onChange={(e) => updateTemplateField('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tranche d'âge</label>
                <input
                  type="text"
                  value={template.ageRange}
                  onChange={(e) => updateTemplateField('ageRange', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={template.description}
                onChange={(e) => updateTemplateField('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Variables */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Variables</h2>
              <button
                onClick={addVariable}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Ajouter une variable
              </button>
            </div>
            {template.variables.length === 0 ? (
              <p className="text-gray-500">Aucune variable définie</p>
            ) : (
              <div className="space-y-4">
                {template.variables.map((variable, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                          type="text"
                          value={variable.name}
                          onChange={(e) => updateVariable(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={variable.type}
                          onChange={(e) => updateVariable(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="boolean">Boolean</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Valeur par défaut</label>
                        <input
                          type={variable.type === 'number' ? 'number' : 'text'}
                          value={variable.defaultValue}
                          onChange={(e) => updateVariable(index, 'defaultValue',
                            variable.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                          )}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => removeVariable(index)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Layout en trois colonnes */}
          <div className="flex gap-6 h-[calc(100vh-200px)]">
            <ElementSidebar
              zones={zones}
              onAddZone={handleAddZone}
              onUpdateZone={handleUpdateZone}
              onDeleteZone={handleDeleteZone}
              templateId={id}
            />

            {/* Canvas d'édition */}
            <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Aperçu du PDF</h2>
              </div>
              <div className="h-full overflow-auto">
                <EditorCanvas
                  pdfUrl={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/templates/pdf/${template.pdfPath}`}
                  elements={template.elements}
                  selectedElementIndex={selectedElement ? selectedElement.index : null}
                  onElementSelect={(index) => index === -1 ? deselectElement() : selectElement(index)}
                  onElementUpdate={updateElement}
                  onElementMove={(index, position) => updateElement(index, 'position', position)}
                  currentPage={currentPdfPage}
                  totalPages={1} // TODO: Get actual total pages from PDF
                  onPageChange={setCurrentPdfPage}
                />
              </div>
            </div>

            <PropertiesSidebar
              selectedZone={selectedZone}
              onUpdateZone={handleUpdateZone}
            />
          </div>

          {/* Éléments (ancienne section) - peut-être à supprimer ou déplacer */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Éléments</h2>
              <button
                onClick={addElement}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Ajouter un élément
              </button>
            </div>
            {template.elements.length === 0 ? (
              <p className="text-gray-500">Aucun élément défini</p>
            ) : (
              <div className="space-y-4">
                {template.elements.map((element, index) => (
                  <div key={index} className={`border border-gray-200 rounded-md p-4 ${selectedElement?.index === index ? 'border-blue-500 bg-blue-50' : ''}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={element.type}
                          onChange={(e) => updateElement(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="text">Texte</option>
                          <option value="image">Image</option>
                          <option value="shape">Forme</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                        <input
                          type="text"
                          value={element.content}
                          onChange={(e) => updateElement(index, 'content', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => removeElement(index)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position X</label>
                        <input
                          type="number"
                          value={element.position.x}
                          onChange={(e) => updateElement(index, 'position', { ...element.position, x: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position Y</label>
                        <input
                          type="number"
                          value={element.position.y}
                          onChange={(e) => updateElement(index, 'position', { ...element.position, y: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Largeur</label>
                        <input
                          type="number"
                          value={element.size.w}
                          onChange={(e) => updateElement(index, 'size', { ...element.size, w: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hauteur</label>
                        <input
                          type="number"
                          value={element.size.h}
                          onChange={(e) => updateElement(index, 'size', { ...element.size, h: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}