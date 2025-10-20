'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTemplates, Template } from '../lib/useTemplates';

const TemplateHighlightSection: React.FC = () => {
  const router = useRouter();
  const { templates, loading, error } = useTemplates();

  // Trier les templates par date de création (plus récents en premier) et prendre les 4 premiers
  const highlightedTemplates = templates
    .filter(template => template.status === 'public') // Seulement les templates publics
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const handleTemplateClick = (templateId: string) => {
    router.push(`/editor/${templateId}`);
  };

  const handleDownloadPDF = (pdfPath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/${pdfPath}`, '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              Templates populaires
            </h2>
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">Chargement des templates...</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || highlightedTemplates.length === 0) {
    return null; // Ne pas afficher la section si erreur ou pas de templates
  }

  return (
    <motion.section
      className="py-12 md:py-20 bg-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 md:mb-12"
          variants={itemVariants}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Templates populaires
          </h2>
          <p className="text-base md:text-lg text-gray-600 px-4">
            Découvrez nos templates les plus récents et commencez à créer votre histoire
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
        >
          {highlightedTemplates.map((template, index) => (
            <motion.div
              key={template._id}
              className="bg-gray-50 rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 cursor-pointer group"
              onClick={() => handleTemplateClick(template._id)}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="p-4 md:p-6">
                {/* En-tête avec statut */}
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {template.title}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Public
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3 md:mb-4 line-clamp-3">
                  {template.description}
                </p>

                {/* Métadonnées */}
                <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-500 mb-3 md:mb-4">
                  <div className="flex justify-between">
                    <span><strong>Catégorie:</strong></span>
                    <span>{template.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span><strong>Âge:</strong></span>
                    <span>{template.ageRange}</span>
                  </div>
                  <div className="flex justify-between">
                    <span><strong>Créé le:</strong></span>
                    <span>{new Date(template.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleTemplateClick(template._id)}
                    className="flex-1 px-2 md:px-3 py-2 bg-blue-600 text-white text-xs md:text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Utiliser ce template
                  </button>
                  <button
                    onClick={(e) => handleDownloadPDF(template.pdfPath, e)}
                    className="px-2 md:px-3 py-2 bg-gray-600 text-white text-xs md:text-sm rounded hover:bg-gray-700 transition-colors"
                    title="Télécharger le PDF"
                  >
                    📄
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bouton voir tous les templates */}
        <motion.div
          className="text-center mt-8 md:mt-12"
          variants={itemVariants}
        >
          <button
            onClick={() => router.push('/templates')}
            className="px-4 md:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
          >
            Voir tous les templates
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TemplateHighlightSection;