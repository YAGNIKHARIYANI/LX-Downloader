import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Whitelist local network development origins to allow multi-device testing over Wi-Fi
  allowedDevOrigins: ["192.168.1.111", "localhost:3000"]
} as any;

export default nextConfig;
