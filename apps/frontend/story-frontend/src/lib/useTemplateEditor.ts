import { useState, useCallback, useEffect } from 'react';
import api from './api';

// Types pour les éléments du template (basés sur le schéma backend)
export interface Variable {
  name: string;
  type: string;
  defaultValue: any;
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  w: number;
  h: number;
}

export interface Element {
  type: string;
  content: string;
  position: Position;
  size: Size;
}

export interface Template {
  _id: string;
  title: string;
  description: string;
  category: string;
  ageRange: string;
  pdfPath: string;
  variables: Variable[];
  elements: Element[];
  status: 'draft' | 'public';
  createdBy: {
    _id: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Types pour l'état de l'éditeur
export interface SelectedElement {
  index: number;
  element: Element;
}

export interface DragState {
  isDragging: boolean;
  draggedElement: Element | null;
  dragOffset: Position;
}

export interface UseTemplateEditorReturn {
  // État du template
  template: Template | null;
  loading: boolean;
  saving: boolean;
  error: string | null;

  // État de l'éditeur
  selectedElement: SelectedElement | null;
  dragState: DragState;
  currentPdfPage: number;

  // Actions du template
  loadTemplate: (id: string) => Promise<void>;
  saveTemplate: () => Promise<void>;
  updateTemplateField: (field: keyof Template, value: any) => void;

  // Actions des variables
  addVariable: () => void;
  updateVariable: (index: number, field: keyof Variable, value: any) => void;
  removeVariable: (index: number) => void;

  // Actions des éléments
  addElement: () => void;
  updateElement: (index: number, field: keyof Element, value: any) => void;
  removeElement: (index: number) => void;

  // Actions de sélection
  selectElement: (index: number) => void;
  deselectElement: () => void;

  // Actions de drag/drop
  startDrag: (element: Element, mousePos: Position) => void;
  updateDrag: (mousePos: Position) => void;
  endDrag: () => void;

  // Actions de la page PDF
  setCurrentPdfPage: (page: number) => void;
  nextPdfPage: () => void;
  prevPdfPage: () => void;
}

export function useTemplateEditor(): UseTemplateEditorReturn {
  // État du template
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // État de l'éditeur
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedElement: null,
    dragOffset: { x: 0, y: 0 },
  });
  const [currentPdfPage, setCurrentPdfPage] = useState(1);

  // Charger un template
  const loadTemplate = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/templates/${id}`);
      setTemplate(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement du template');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sauvegarder le template
  const saveTemplate = useCallback(async () => {
    if (!template) return;

    try {
      setSaving(true);
      setError(null);
      await api.put(`/templates/${template._id}`, {
        title: template.title,
        description: template.description,
        category: template.category,
        ageRange: template.ageRange,
        variables: template.variables,
        elements: template.elements,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
      throw err;
    } finally {
      setSaving(false);
    }
  }, [template]);

  // Mettre à jour un champ du template
  const updateTemplateField = useCallback((field: keyof Template, value: any) => {
    if (!template) return;
    setTemplate({ ...template, [field]: value });
  }, [template]);

  // Ajouter une variable
  const addVariable = useCallback(() => {
    if (!template) return;
    const newVariable: Variable = { name: '', type: 'string', defaultValue: '' };
    setTemplate({
      ...template,
      variables: [...template.variables, newVariable],
    });
  }, [template]);

  // Mettre à jour une variable
  const updateVariable = useCallback((index: number, field: keyof Variable, value: any) => {
    if (!template) return;
    const updatedVariables = [...template.variables];
    updatedVariables[index] = { ...updatedVariables[index], [field]: value };
    setTemplate({ ...template, variables: updatedVariables });
  }, [template]);

  // Supprimer une variable
  const removeVariable = useCallback((index: number) => {
    if (!template) return;
    const updatedVariables = template.variables.filter((_, i) => i !== index);
    setTemplate({ ...template, variables: updatedVariables });
  }, [template]);

  // Ajouter un élément
  const addElement = useCallback(() => {
    if (!template) return;
    const newElement: Element = {
      type: 'text',
      content: '',
      position: { x: 0, y: 0 },
      size: { w: 100, h: 50 },
    };
    setTemplate({
      ...template,
      elements: [...template.elements, newElement],
    });
  }, [template]);

  // Mettre à jour un élément
  const updateElement = useCallback((index: number, field: keyof Element, value: any) => {
    if (!template) return;
    const updatedElements = [...template.elements];
    updatedElements[index] = { ...updatedElements[index], [field]: value };
    setTemplate({ ...template, elements: updatedElements });

    // Mettre à jour l'élément sélectionné si nécessaire
    if (selectedElement && selectedElement.index === index) {
      setSelectedElement({
        index,
        element: updatedElements[index],
      });
    }
  }, [template, selectedElement]);

  // Supprimer un élément
  const removeElement = useCallback((index: number) => {
    if (!template) return;
    const updatedElements = template.elements.filter((_, i) => i !== index);
    setTemplate({ ...template, elements: updatedElements });

    // Désélectionner si l'élément supprimé était sélectionné
    if (selectedElement && selectedElement.index === index) {
      setSelectedElement(null);
    } else if (selectedElement && selectedElement.index > index) {
      // Ajuster l'index si un élément avant était supprimé
      setSelectedElement({
        index: selectedElement.index - 1,
        element: template.elements[selectedElement.index],
      });
    }
  }, [template, selectedElement]);

  // Sélectionner un élément
  const selectElement = useCallback((index: number) => {
    if (!template) return;
    setSelectedElement({
      index,
      element: template.elements[index],
    });
  }, [template]);

  // Désélectionner l'élément
  const deselectElement = useCallback(() => {
    setSelectedElement(null);
  }, []);

  // Démarrer le drag
  const startDrag = useCallback((element: Element, mousePos: Position) => {
    setDragState({
      isDragging: true,
      draggedElement: element,
      dragOffset: {
        x: mousePos.x - element.position.x,
        y: mousePos.y - element.position.y,
      },
    });
  }, []);

  // Mettre à jour le drag
  const updateDrag = useCallback((mousePos: Position) => {
    if (!dragState.isDragging || !dragState.draggedElement) return;

    const newPosition = {
      x: mousePos.x - dragState.dragOffset.x,
      y: mousePos.y - dragState.dragOffset.y,
    };

    setDragState(prev => ({
      ...prev,
      draggedElement: {
        ...prev.draggedElement!,
        position: newPosition,
      },
    }));
  }, [dragState]);

  // Terminer le drag
  const endDrag = useCallback(() => {
    if (!dragState.isDragging || !dragState.draggedElement || !template) {
      setDragState({
        isDragging: false,
        draggedElement: null,
        dragOffset: { x: 0, y: 0 },
      });
      return;
    }

    // Trouver l'index de l'élément déplacé et le mettre à jour
    const elementIndex = template.elements.findIndex(
      el => el === dragState.draggedElement
    );

    if (elementIndex !== -1) {
      updateElement(elementIndex, 'position', dragState.draggedElement.position);
    }

    setDragState({
      isDragging: false,
      draggedElement: null,
      dragOffset: { x: 0, y: 0 },
    });
  }, [dragState, template, updateElement]);

  // Navigation dans les pages PDF
  const nextPdfPage = useCallback(() => {
    setCurrentPdfPage(prev => prev + 1);
  }, []);

  const prevPdfPage = useCallback(() => {
    setCurrentPdfPage(prev => Math.max(1, prev - 1));
  }, []);

  return {
    // État du template
    template,
    loading,
    saving,
    error,

    // État de l'éditeur
    selectedElement,
    dragState,
    currentPdfPage,

    // Actions du template
    loadTemplate,
    saveTemplate,
    updateTemplateField,

    // Actions des variables
    addVariable,
    updateVariable,
    removeVariable,

    // Actions des éléments
    addElement,
    updateElement,
    removeElement,

    // Actions de sélection
    selectElement,
    deselectElement,

    // Actions de drag/drop
    startDrag,
    updateDrag,
    endDrag,

    // Actions de la page PDF
    setCurrentPdfPage,
    nextPdfPage,
    prevPdfPage,
  };
}