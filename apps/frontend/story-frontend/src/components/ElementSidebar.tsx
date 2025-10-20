'use client';

import React, { useState } from 'react';

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

interface ElementSidebarProps {
  zones: Zone[];
  onAddZone: (zone: Omit<Zone, 'id'>) => void;
  onUpdateZone: (id: string, updates: Partial<Zone>) => void;
  onDeleteZone: (id: string) => void;
  templateId: string;
}

const ElementSidebar: React.FC<ElementSidebarProps> = ({
  zones,
  onAddZone,
  onUpdateZone,
  onDeleteZone,
  templateId,
}) => {
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [newZone, setNewZone] = useState({
    name: '',
    type: 'text' as 'text' | 'image' | 'variable',
    variables: [] as string[],
    content: '',
    position: { x: 0, y: 0 },
    size: { w: 100, h: 50 },
  });

  const handleAddZone = () => {
    if (newZone.name.trim()) {
      onAddZone({
        ...newZone,
        templateId,
      });
      setNewZone({
        name: '',
        type: 'text',
        variables: [],
        content: '',
        position: { x: 0, y: 0 },
        size: { w: 100, h: 50 },
      });
      setIsAddingZone(false);
    }
  };

  const handleCancelAdd = () => {
    setNewZone({
      name: '',
      type: 'text',
      variables: [],
      content: '',
      position: { x: 0, y: 0 },
      size: { w: 100, h: 50 },
    });
    setIsAddingZone(false);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Zones</h3>
        <button
          onClick={() => setIsAddingZone(true)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          + Ajouter
        </button>
      </div>

      {/* Formulaire d'ajout de zone */}
      {isAddingZone && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md border">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Nouvelle zone</h4>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nom de la zone"
              value={newZone.name}
              onChange={(e) => setNewZone({ ...newZone, name: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select
              value={newZone.type}
              onChange={(e) => setNewZone({ ...newZone, type: e.target.value as 'text' | 'image' | 'variable' })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="text">Texte</option>
              <option value="image">Image</option>
              <option value="variable">Variable</option>
            </select>
            <input
              type="text"
              placeholder="Contenu"
              value={newZone.content}
              onChange={(e) => setNewZone({ ...newZone, content: e.target.value })}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleAddZone}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Ajouter
              </button>
              <button
                onClick={handleCancelAdd}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des zones */}
      <div className="space-y-2">
        {zones.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Aucune zone définie</p>
        ) : (
          zones.map((zone) => (
            <div key={zone.id} className="border border-gray-200 rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{zone.name}</h4>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    zone.type === 'text' ? 'bg-blue-100 text-blue-800' :
                    zone.type === 'image' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {zone.type}
                  </span>
                </div>
                <button
                  onClick={() => onDeleteZone(zone.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  ✕
                </button>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Position: ({zone.position.x}, {zone.position.y})</div>
                <div>Taille: {zone.size.w} × {zone.size.h}</div>
                {zone.content && <div>Contenu: {zone.content}</div>}
                {zone.variables.length > 0 && (
                  <div>Variables: {zone.variables.join(', ')}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ElementSidebar;