/** @type {import('next').NextConfig} */
const nextConfig = {
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
