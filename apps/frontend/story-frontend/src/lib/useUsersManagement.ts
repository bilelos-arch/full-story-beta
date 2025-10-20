import { useState, useEffect, useCallback, useMemo } from 'react';
import api from './api';

// Types pour les utilisateurs (basés sur le schéma backend)
export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  role?: 'admin' | 'user';
  search?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface UseUsersManagementReturn {
  users: User[];
  filteredUsers: User[];
  loading: boolean;
  error: string | null;
  filters: UserFilters;
  setFilters: (filters: UserFilters) => void;
  fetchUsers: () => Promise<void>;
  createUser: (userData: CreateUserData) => Promise<void>;
  updateUser: (id: string, userData: Partial<CreateUserData>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
  // États pour les modales
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

const initialFilters: UserFilters = {
  role: undefined,
  search: undefined,
};

export function useUsersManagement(): UseUsersManagementReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  // États pour les modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filtrage des utilisateurs basé sur les filtres actuels
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Filtre par rôle
      if (filters.role && user.role !== filters.role) {
        return false;
      }

      // Filtre par recherche (email)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const emailMatch = user.email.toLowerCase().includes(searchLower);
        if (!emailMatch) {
          return false;
        }
      }

      return true;
    });
  }, [users, filters]);

  // Fonction pour récupérer tous les utilisateurs
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err: any) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour créer un utilisateur
  const createUser = useCallback(async (userData: CreateUserData) => {
    try {
      const response = await api.post('/users', userData);
      setUsers(prev => [...prev, response.data]);
    } catch (err: any) {
      console.error('Erreur lors de la création de l\'utilisateur:', err);
      setError(err.response?.data?.message || 'Erreur lors de la création de l\'utilisateur');
      throw err;
    }
  }, []);

  // Fonction pour mettre à jour un utilisateur
  const updateUser = useCallback(async (id: string, userData: Partial<CreateUserData>) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      setUsers(prev => prev.map(user => user._id === id ? response.data : user));
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour de l\'utilisateur');
      throw err;
    }
  }, []);

  // Fonction pour supprimer un utilisateur
  const deleteUser = useCallback(async (id: string) => {
    try {
      // Optimistic update
      setUsers(prev => prev.filter(user => user._id !== id));

      await api.delete(`/users/${id}`);
    } catch (err: any) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
      // Revert optimistic update en cas d'erreur
      await fetchUsers(); // Recharger les utilisateurs en cas d'erreur
      setError(err.response?.data?.message || 'Erreur lors de la suppression de l\'utilisateur');
      throw err; // Re-throw pour que le composant puisse gérer l'erreur
    }
  }, [users, fetchUsers]);

  // Fonction pour rafraîchir les données
  const refetch = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  // Chargement initial des utilisateurs
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    filteredUsers,
    loading,
    error,
    filters,
    setFilters,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    refetch,
    // États pour les modales
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedUser,
    setSelectedUser,
  };
}