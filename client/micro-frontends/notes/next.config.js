const NextFederationPlugin = require('@module-federation/nextjs-mf');

const nextConfig = {
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: 'notes',
          filename: 'static/chunks/remoteEntry.js',
          remotes: {
            auth: `auth@http://localhost:3001/_next/static/chunks/remoteEntry.js`,
            shared: `shared@http://localhost:3003/_next/static/chunks/remoteEntry.js`,
          },
          exposes: {
            './Dashboard': './src/pages/dashboard/page.jsx',
            './Summary': './src/pages/summary/page.jsx',
            './Home': './src/pages/home/page.jsx',
          },
          shared: {
            react: {
              singleton: true,
              requiredVersion: false,
            },
            'react-dom': {
              singleton: true,
              requiredVersion: false,
            },
          },
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig; 