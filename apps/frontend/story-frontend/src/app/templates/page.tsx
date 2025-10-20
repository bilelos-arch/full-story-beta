'use client';

import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import TemplateList from '../../components/TemplateList';

export default function TemplatesPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retour au Dashboard
            </button>
          </div>

          <TemplateList />
        </div>
      </div>
    </ProtectedRoute>
  );
}