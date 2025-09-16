/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure proper static generation
  trailingSlash: false,
  // Ensure proper image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
