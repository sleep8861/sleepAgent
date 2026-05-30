/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/sleep-agent",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
