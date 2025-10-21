import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  webpack: (config) => {
    // Empêche les erreurs liées au module 'canvas'
    config.resolve.alias.canvas = false;

    return config;
  },

  // ✅ Supprimé : experimental.turbopack (n’existe plus)
  experimental: {
    // Tu peux ajouter d'autres features expérimentales valides ici si besoin
    // serverActions: true,
  },
};

export default nextConfig;
