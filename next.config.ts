import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["sb-changes.onrender.com", "localhost"],
  },
  remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/usuarios/obtenerArchivo/**",
      },
      {
        protocol: "https",
        hostname: "sb-changes.onrender.com",
        pathname: "/**",
      },
    ],
};

export default nextConfig;
