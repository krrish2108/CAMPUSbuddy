/** @type {import('next').Config} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com', 'images.unsplash.com'],
  },
  eslint: {
    // Warning and lint errors won't break Vercel deployment builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}
module.exports = nextConfig
