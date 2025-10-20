import React from 'react';

interface MetricTileProps {
  title: string;
  total: number | string;
  icon: React.ReactNode;
}

export default function MetricTile({ title, total, icon }: MetricTileProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{total}</p>
        </div>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );
}