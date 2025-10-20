'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/login');
  };

  const handleLearnMore = () => {
    // Scroll vers une section ou ouvrir une modal
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Créez des histoires personnalisées en quelques clics
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Transformez vos idées en récits captivants avec notre plateforme intuitive.
          Des templates professionnels, un éditeur puissant et des outils avancés pour donner vie à votre créativité.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-6 md:px-8 py-3 rounded-lg font-semibold text-base md:text-lg hover:bg-gray-100 transition-colors w-full sm:w-auto"
          >
            Commencer maintenant
          </button>
          <button
            onClick={handleLearnMore}
            className="border-2 border-white text-white px-6 md:px-8 py-3 rounded-lg font-semibold text-base md:text-lg hover:bg-white hover:text-blue-600 transition-colors w-full sm:w-auto"
          >
            En savoir plus
          </button>
        </motion.div>
      </div>
    </section>
  );
}