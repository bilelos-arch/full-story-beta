import { useState, useCallback } from 'react';
import api from './api';

// Types pour les zones (basés sur le schéma backend)
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  w: number;
  h: number;
}

export enum ZoneType {
  TEXT = 'text',
  IMAGE = 'image',
  VARIABLE = 'variable',
}

export interface Zone {
  _id: string;
  templateId: string;
  name: string;
  type: ZoneType;
  variables: string[];
  content: string;
  position: Position;
  size: Size;
  createdAt: string;
  updatedAt: string;
}

export interface CreateZoneData {
  templateId: string;
  name: string;
  type: ZoneType;
  variables: string[];
  content: string;
  position: Position;
  size: Size;
}

export interface UpdateZoneData {
  name?: string;
  type?: ZoneType;
  variables?: string[];
  content?: string;
  position?: Position;
  size?: Size;
}

export interface UseZonesReturn {
  zones: Zone[];
  loading: boolean;
  error: string | null;
  fetchZones: (templateId: string) => Promise<void>;
  createZone: (zoneData: CreateZoneData) => Promise<Zone>;
  updateZone: (id: string, zoneData: UpdateZoneData) => Promise<Zone>;
  deleteZone: (id: string) => Promise<void>;
  clearError: () => void;
}

export function useZones(): UseZonesReturn {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les zones par templateId
  const fetchZones = useCallback(async (templateId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/zones/${templateId}`);
      setZones(response.data);
    } catch (err: any) {
      console.error('Erreur lors du chargement des zones:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des zones');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une nouvelle zone
  const createZone = useCallback(async (zoneData: CreateZoneData): Promise<Zone> => {
    try {
      setError(null);
      const response = await api.post('/zones', zoneData);
      const newZone = response.data;

      // Ajouter la nouvelle zone à la liste
      setZones(prev => [...prev, newZone]);

      return newZone;
    } catch (err: any) {
      console.error('Erreur lors de la création de la zone:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création de la zone');
      throw err;
    }
  }, []);

  // Mettre à jour une zone
  const updateZone = useCallback(async (id: string, zoneData: UpdateZoneData): Promise<Zone> => {
    try {
      setError(null);
      const response = await api.put(`/zones/${id}`, zoneData);
      const updatedZone = response.data;

      // Mettre à jour la zone dans la liste
      setZones(prev =>
        prev.map(zone =>
          zone._id === id ? updatedZone : zone
        )
      );

      return updatedZone;
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la zone:', err);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour de la zone');
      throw err;
    }
  }, []);

  // Supprimer une zone
  const deleteZone = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);

      // Optimistic update
      setZones(prev => prev.filter(zone => zone._id !== id));

      await api.delete(`/zones/${id}`);
    } catch (err: any) {
      console.error('Erreur lors de la suppression de la zone:', err);
      setError(err.response?.data?.message || 'Erreur lors de la suppression de la zone');
      throw err;
    }
  }, []);

  // Effacer l'erreur
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    zones,
    loading,
    error,
    fetchZones,
    createZone,
    updateZone,
    deleteZone,
    clearError,
  };
}