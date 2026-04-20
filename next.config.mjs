/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['10.218.94.209', '10.30.22.198', 'localhost', '127.0.0.1','10.163.11.11:3000'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
