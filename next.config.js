/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    newNextLinkBehavior: true
  },
  images: {
    domains: ['files.bikeindex.org', 'bikebook.s3.amazonaws.com'],
    deviceSizes: [320, 375, 768, 1024, 1280]
  },
  reactStrictMode: true,
  swcMinify: true
}

module.exports = nextConfig
