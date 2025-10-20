'use client';

import React from 'react';

interface Zone {
  id: string;
  name: string;
  type: 'text' | 'image' | 'variable';
  variables: string[];
  content: string;
  position: { x: number; y: number };
  size: { w: number; h: number };
  templateId: string;
}

interface PropertiesSidebarProps {
  selectedZone: Zone | null;
  onUpdateZone: (id: string, updates: Partial<Zone>) => void;
}

const PropertiesSidebar: React.FC<PropertiesSidebarProps> = ({
  selectedZone,
  onUpdateZone,
}) => {
  if (!selectedZone) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Propriétés</h3>
        <p className="text-sm text-gray-500">Sélectionnez une zone pour voir ses propriétés</p>
      </div>
    );
  }

  const handleFieldChange = (field: keyof Zone, value: any) => {
    onUpdateZone(selectedZone.id, { [field]: value });
  };

  const handlePositionChange = (axis: 'x' | 'y', value: number) => {
    onUpdateZone(selectedZone.id, {
      position: { ...selectedZone.position, [axis]: value }
    });
  };

  const handleSizeChange = (dimension: 'w' | 'h', value: number) => {
    onUpdateZone(selectedZone.id, {
      size: { ...selectedZone.size, [dimension]: value }
    });
  };

  const handleVariablesChange = (variables: string[]) => {
    onUpdateZone(selectedZone.id, { variables });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Propriétés de la zone</h3>

      <div className="space-y-4">
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            value={selectedZone.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={selectedZone.type}
            onChange={(e) => handleFieldChange('type', e.target.value as 'text' | 'image' | 'variable')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="text">Texte</option>
            <option value="image">Image</option>
            <option value="variable">Variable</option>
          </select>
        </div>

        {/* Contenu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
          <textarea
            value={selectedZone.content}
            onChange={(e) => handleFieldChange('content', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contenu de la zone..."
          />
        </div>

        {/* Variables (si type variable) */}
        {selectedZone.type === 'variable' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Variables</label>
            <input
              type="text"
              value={selectedZone.variables.join(', ')}
              onChange={(e) => handleVariablesChange(e.target.value.split(',').map(v => v.trim()).filter(v => v))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="var1, var2, var3"
            />
            <p className="text-xs text-gray-500 mt-1">Séparez les variables par des virgules</p>
          </div>
        )}

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">X</label>
              <input
                type="number"
                value={selectedZone.position.x}
                onChange={(e) => handlePositionChange('x', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Y</label>
              <input
                type="number"
                value={selectedZone.position.y}
                onChange={(e) => handlePositionChange('y', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Taille */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Taille</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Largeur</label>
              <input
                type="number"
                value={selectedZone.size.w}
                onChange={(e) => handleSizeChange('w', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Hauteur</label>
              <input
                type="number"
                value={selectedZone.size.h}
                onChange={(e) => handleSizeChange('h', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ID (lecture seule) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
          <input
            type="text"
            value={selectedZone.id}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertiesSidebar;