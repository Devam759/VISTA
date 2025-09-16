/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove outputFileTracingRoot as it can cause issues on Vercel
  experimental: {
    // Enable modern features
    serverComponentsExternalPackages: [],
  },
  // Ensure proper static generation
  trailingSlash: false,
  // Handle API routes properly
  async rewrites() {
    return [
      // Add any API rewrites if needed
    ];
  },
};

export default nextConfig;
