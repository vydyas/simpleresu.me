/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['github.com', 'avatars.githubusercontent.com', 'www.google.com', 'www.microsoft.com', 'www.facebook.com', 'www.netflix.com', 'www.apple.com', 'www.salesforce.com'],
  },
}

module.exports = nextConfig
