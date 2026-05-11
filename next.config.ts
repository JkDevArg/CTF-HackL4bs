import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "@react-three/postprocessing"],
  images: {
    unoptimized: true,
    qualities: [25, 50, 75, 100],
    formats: ['image/webp'],
  },
  output: 'export',
  // Empty turbopack config to suppress the warning (GLSL files are handled via raw imports as strings)
  turbopack: {},
};

export default nextConfig;
