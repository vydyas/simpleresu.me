const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: true,
  openAnalyzer: true,
});

const nextConfig = require('./next.config.js');

module.exports = withBundleAnalyzer(nextConfig); 