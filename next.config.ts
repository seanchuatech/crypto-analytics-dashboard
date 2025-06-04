// next.config.js (CommonJS format)
const nextConfig = {
  webpack: (config: { resolve: { alias: { [x: string]: string; }; }; }) => {
    config.resolve.alias['@react-pdf/renderer'] =
      '@react-pdf/renderer/lib/react-pdf.browser.es.js';
    return config;
  },
};

module.exports = nextConfig;
