import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  webpack: (config) => {
    turbopack: {

    // Empêche les erreurs liées au module 'canvas'
    config.resolve.alias.canvas = false;

    // Ajoute le fallback pour dommatrix
    config.resolve.fallback = {
      ...config.resolve.fallback,
      dommatrix: require.resolve("dommatrix"),
    }
    };
    return config;
  },

  // ✅ Supprimé : experimental.turbopack (n’existe plus)
  experimental: {
    // Tu peux ajouter d'autres features expérimentales valides ici si besoin
    // serverActions: true,
  },
};

export default nextConfig;
