import React, { useRef, useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'dommatrix'; // Polyfill pour DOMMatrix

// Configuration de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

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

interface EditorCanvasProps {
  pdfUrl: string;
  elements: Element[];
  selectedElementIndex: number | null;
  onElementSelect: (index: number) => void;
  onElementUpdate: (index: number, field: keyof Element, value: any) => void;
  onElementMove: (index: number, newPosition: Position) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  scale?: number;
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  pdfUrl,
  elements,
  selectedElementIndex,
  onElementSelect,
  onElementUpdate,
  onElementMove,
  currentPage,
  totalPages,
  onPageChange,
  scale = 1.0,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [pdfDimensions, setPdfDimensions] = useState<Size>({ w: 0, h: 0 });

  const handleDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    // Le nombre total de pages est géré par le parent
  }, []);

  const handlePageLoadSuccess = useCallback((page: any) => {
    const { width, height } = page;
    setPdfDimensions({ w: width * scale, h: height * scale });
  }, [scale]);

  const handleMouseDown = useCallback((e: React.MouseEvent, elementIndex: number) => {
    e.stopPropagation();
    const element = elements[elementIndex];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setDragOffset({
      x: mouseX - element.position.x,
      y: mouseY - element.position.y,
    });
    setIsDragging(true);
    onElementSelect(elementIndex);
  }, [elements, onElementSelect]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || selectedElementIndex === null) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newPosition = {
      x: mouseX - dragOffset.x,
      y: mouseY - dragOffset.y,
    };

    onElementMove(selectedElementIndex, newPosition);
  }, [isDragging, selectedElementIndex, dragOffset, onElementMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onElementSelect(-1); // Désélectionner
    }
  }, [onElementSelect]);

  const renderElement = (element: Element, index: number) => {
    const isSelected = selectedElementIndex === index;

    return (
      <div
        key={index}
        className={`absolute cursor-move border-2 ${
          isSelected ? 'border-blue-500 bg-blue-100' : 'border-transparent bg-white bg-opacity-80'
        } hover:border-gray-400 transition-colors`}
        style={{
          left: element.position.x,
          top: element.position.y,
          width: element.size.w,
          height: element.size.h,
          minWidth: 50,
          minHeight: 20,
        }}
        onMouseDown={(e) => handleMouseDown(e, index)}
      >
        <div className="w-full h-full p-2 overflow-hidden">
          {element.type === 'text' && (
            <div className="text-sm break-words">{element.content || 'Texte'}</div>
          )}
          {element.type === 'image' && (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
              Image
            </div>
          )}
          {element.type === 'shape' && (
            <div className="w-full h-full bg-gray-300 border border-gray-400 rounded">
              {element.content || 'Forme'}
            </div>
          )}
        </div>

        {/* Poignées de redimensionnement */}
        {isSelected && (
          <>
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize"></div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
      {/* Contrôles de navigation PDF */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-md p-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 text-sm"
          >
            Précédent
          </button>

          <span className="text-sm">
            Page {currentPage} sur {totalPages}
          </span>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 text-sm"
          >
            Suivant
          </button>
        </div>
      </div>

      {/* Canvas principal */}
      <div
        ref={canvasRef}
        className="relative cursor-crosshair"
        style={{
          width: pdfDimensions.w || 600,
          height: pdfDimensions.h || 800,
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {/* Affichage du PDF */}
        <Document
          file={pdfUrl}
          onLoadSuccess={handleDocumentLoadSuccess}
          loading={<div className="flex items-center justify-center h-full">Chargement du PDF...</div>}
          error={<div className="flex items-center justify-center h-full text-red-500">Erreur de chargement du PDF</div>}
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            onLoadSuccess={handlePageLoadSuccess}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>

        {/* Superposition des éléments */}
        {elements.map((element, index) => renderElement(element, index))}
      </div>

      {/* Informations de débogage */}
      {selectedElementIndex !== null && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
          <h4 className="font-semibold text-sm mb-2">Élément sélectionné</h4>
          <div className="text-xs space-y-1">
            <div>Type: {elements[selectedElementIndex]?.type}</div>
            <div>Position: ({Math.round(elements[selectedElementIndex]?.position.x)}, {Math.round(elements[selectedElementIndex]?.position.y)})</div>
            <div>Taille: {elements[selectedElementIndex]?.size.w} x {elements[selectedElementIndex]?.size.h}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorCanvas;