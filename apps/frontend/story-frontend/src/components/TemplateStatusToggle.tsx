import React, { useState } from 'react';
import api from '../lib/api';

interface TemplateStatusToggleProps {
  templateId: string;
  currentStatus: 'draft' | 'public';
  onStatusChange: (newStatus: 'draft' | 'public') => void;
}

const TemplateStatusToggle: React.FC<TemplateStatusToggleProps> = ({
  templateId,
  currentStatus,
  onStatusChange,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    const newStatus = currentStatus === 'draft' ? 'public' : 'draft';
    setIsUpdating(true);
    setError(null);

    try {
      await api.put(`/templates/${templateId}/status`, { status: newStatus });
      onStatusChange(newStatus);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du statut');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">
        Statut: <span className={`font-medium ${currentStatus === 'public' ? 'text-green-600' : 'text-yellow-600'}`}>
          {currentStatus === 'public' ? 'Public' : 'Draft'}
        </span>
      </span>
      <button
        onClick={handleToggle}
        disabled={isUpdating}
        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
          currentStatus === 'public'
            ? 'bg-green-100 text-green-800 hover:bg-green-200'
            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isUpdating ? 'Mise à jour...' : currentStatus === 'public' ? 'Passer en Draft' : 'Publier'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
};

export default TemplateStatusToggle;