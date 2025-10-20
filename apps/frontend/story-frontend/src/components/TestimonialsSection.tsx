'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Marie Dubois',
    role: 'Enseignante',
    company: 'École Primaire Saint-Joseph',
    content: 'Cette plateforme a révolutionné la façon dont je crée des histoires pour mes élèves. Les templates sont magnifiques et l\'éditeur est si intuitif !',
    avatar: '👩‍🏫',
    rating: 5,
  },
  {
    id: '2',
    name: 'Pierre Martin',
    role: 'Parent',
    company: 'Famille Martin',
    content: 'Mes enfants adorent créer leurs propres histoires. C\'est un excellent moyen de développer leur créativité tout en apprenant à écrire.',
    avatar: '👨‍👩‍👧‍👦',
    rating: 5,
  },
  {
    id: '3',
    name: 'Sophie Laurent',
    role: 'Bibliothécaire',
    company: 'Bibliothèque Municipale',
    content: 'Nous utilisons cette plateforme pour nos ateliers d\'écriture. Les enfants sont ravis et les résultats sont impressionnants.',
    avatar: '👩‍💼',
    rating: 5,
  },
  {
    id: '4',
    name: 'Jean-François Moreau',
    role: 'Écrivain indépendant',
    company: 'Freelance',
    content: 'L\'export PDF est parfait pour mes projets clients. La qualité professionnelle et la facilité d\'utilisation font toute la différence.',
    avatar: '👨‍💻',
    rating: 5,
  },
];

const TestimonialsSection: React.FC = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
        duration: 0.6,
      },
    },
  };

  return (
    <motion.section
      className="py-12 md:py-20 bg-gray-50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-8 md:mb-16"
          variants={itemVariants}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Découvrez comment Story Creator aide les enseignants, parents et créatifs à donner vie à leurs histoires
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
          variants={containerVariants}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-sm border p-4 md:p-6 hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Rating */}
              <div className="flex items-center mb-3 md:mb-4">
                {renderStars(testimonial.rating)}
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 mb-4 md:mb-6 italic text-sm md:text-base">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <div className="text-xl md:text-2xl mr-3">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm md:text-base">
                    {testimonial.name}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="text-center mt-8 md:mt-12"
          variants={itemVariants}
        >
          <p className="text-gray-600 mb-4 text-sm md:text-base">
            Rejoignez des milliers d'utilisateurs satisfaits
          </p>
          <div className="flex items-center justify-center space-x-2">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xs md:text-sm border-2 border-white">
                M
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold text-xs md:text-sm border-2 border-white">
                P
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-xs md:text-sm border-2 border-white">
                S
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-semibold text-xs md:text-sm border-2 border-white">
                J
              </div>
            </div>
            <span className="text-gray-600 text-xs md:text-sm ml-4">
              +10,000 utilisateurs actifs
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;