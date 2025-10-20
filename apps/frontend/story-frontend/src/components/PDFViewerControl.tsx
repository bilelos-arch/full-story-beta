import React, { useState } from 'react';

interface PDFViewerControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PDFViewerControl: React.FC<PDFViewerControlProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(inputPage, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      setInputPage(currentPage.toString());
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-gray-100 rounded-lg">
      <button
        onClick={handlePrevious}
        disabled={currentPage <= 1}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
      >
        Précédent
      </button>

      <form onSubmit={handleInputSubmit} className="flex items-center space-x-2">
        <span className="text-sm">Page</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={handleInputChange}
          className="w-16 px-2 py-1 border rounded text-center"
        />
        <span className="text-sm">sur {totalPages}</span>
      </form>

      <button
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600"
      >
        Suivant
      </button>
    </div>
  );
};

export default PDFViewerControl;