'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '../../../../lib/api';
import ProtectedRoute from '../../../../components/ProtectedRoute';
import TemplateStatusToggle from '../../../../components/TemplateStatusToggle';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Textarea } from '../../../../components/ui/textarea';
import { Upload, FileText, Image as ImageIcon } from 'lucide-react';

// Removed PDFViewerControl import as preview step is removed

// Zod schema for form validation
const templateSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  category: z.string().min(1, 'La catégorie est requise'),
  genre: z.string().min(1, 'Le genre est requis'),
  ageRange: z.string().min(1, 'La tranche d\'âge est requise'),
  status: z.enum(['draft', 'public'], { message: 'Le statut est requis' }),
});

type TemplateFormData = z.infer<typeof templateSchema>;


export default function NewTemplatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  // Removed PDFViewerControl state and useEffect as preview step is removed

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      status: 'draft',
    },
  });

  const watchedStatus = watch('status');

  const handlePdfUpload = (file: File) => {
    setPdfFile(file);
    // No longer auto-advancing to step 1, stay on step 1 for file uploads
  };

  const handleCoverImageUpload = (file: File) => {
    setCoverImage(file);
  };

  const onSubmit = async (data: TemplateFormData) => {
    if (!pdfFile) {
      setError('Veuillez d\'abord télécharger un PDF');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('genre', data.genre);
      formData.append('ageRange', data.ageRange);
      formData.append('status', data.status);
      formData.append('pdf', pdfFile);
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      // Debug logging: Log FormData contents
      console.log('Frontend FormData before API call:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await api.post('/templates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const newTemplateId = response.data._id;

      router.push(`/editor/${newTemplateId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création du template');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Créer un nouveau template</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: General Information */}
            {currentStep === 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Informations générales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      placeholder="Entrez le titre du template"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select onValueChange={(value) => setValue('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="education">Éducation</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="personal">Personnel</SelectItem>
                        <SelectItem value="creative">Créatif</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="genre">Genre *</Label>
                    <Select onValueChange={(value) => setValue('genre', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fiction">Fiction</SelectItem>
                        <SelectItem value="non-fiction">Non-fiction</SelectItem>
                        <SelectItem value="poetry">Poésie</SelectItem>
                        <SelectItem value="drama">Drame</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.genre && (
                      <p className="text-sm text-red-600 mt-1">{errors.genre.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="ageRange">Tranche d'âge *</Label>
                    <Input
                      id="ageRange"
                      {...register('ageRange')}
                      placeholder="Entrez la tranche d'âge recommandée"
                    />
                    {errors.ageRange && (
                      <p className="text-sm text-red-600 mt-1">{errors.ageRange.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Entrez une description détaillée"
                      rows={4}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label>Statut *</Label>
                    <TemplateStatusToggle
                      templateId="new"
                      currentStatus={watchedStatus}
                      onStatusChange={(status) => setValue('status', status)}
                    />
                    {errors.status && (
                      <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-2"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: File Uploads and Submit */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6">Téléchargement des fichiers</h2>

                {/* PDF Upload */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF du template *
                  </Label>
                  {!pdfFile ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handlePdfUpload(file);
                          }
                        }}
                        className="hidden"
                        id="pdf-upload"
                      />
                      <label htmlFor="pdf-upload" className="cursor-pointer">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600">
                          Cliquez pour sélectionner un fichier PDF
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">PDF sélectionné</p>
                        <p className="text-xs text-green-600">{pdfFile.name}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cover Image Upload */}
                <div className="mb-6">
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Image de couverture
                  </Label>
                  {!coverImage ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleCoverImageUpload(file);
                          }
                        }}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label htmlFor="cover-upload" className="cursor-pointer">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600">
                          Cliquez pour sélectionner une image de couverture
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                      <ImageIcon className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Image téléchargée</p>
                        <p className="text-xs text-green-600">{coverImage.name}</p>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(0)}
                  >
                    Précédent
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading || !pdfFile}
                    className="px-6 py-2"
                  >
                    {isLoading ? 'Création en cours...' : 'Créer le template'}
                  </Button>
                </div>
              </div>
            )}

            {/* Removed Step 3: Preview and Submit */}
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}