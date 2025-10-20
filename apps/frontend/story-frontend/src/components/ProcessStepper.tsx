'use client';

import { motion } from 'framer-motion';

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ProcessStepperProps {
  steps: Step[];
  currentStep?: number;
}

export default function ProcessStepper({ steps, currentStep = 0 }: ProcessStepperProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <motion.div
      className="py-12 md:py-16 bg-white"
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
            Comment ça marche
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Créez votre histoire en suivant ces 3 étapes simples
          </p>
        </motion.div>

        <div className="relative">
          {/* Ligne de connexion */}
          <div className="hidden md:block absolute top-20 md:top-24 left-0 right-0 h-0.5 bg-gray-200"></div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            variants={containerVariants}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative flex flex-col items-center"
                variants={itemVariants}
              >
                {/* Cercle avec numéro */}
                <motion.div
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4 md:mb-6 transition-colors ${
                    index <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-lg md:text-xl font-bold">{index + 1}</span>
                </motion.div>

                {/* Icône */}
                <motion.div
                  className="mb-3 md:mb-4 text-3xl md:text-4xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {step.icon}
                </motion.div>

                {/* Titre */}
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3 text-center">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 text-center leading-relaxed px-2">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}