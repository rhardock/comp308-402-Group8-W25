const NextFederationPlugin = require('@module-federation/nextjs-mf');

const nextConfig = {
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: 'auth',
          filename: 'static/chunks/remoteEntry.js',
          exposes: {
            './LoginPage': './src/pages/login/page.jsx',
            './RegisterPage': './src/pages/register/page.jsx',
            './AuthContext': './src/context/AuthContext.jsx',
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