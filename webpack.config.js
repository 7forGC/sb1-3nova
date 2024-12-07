const webpack = require('@nativescript/webpack');
const { resolve } = require('path');

module.exports = (env) => {
  webpack.init(env);

  webpack.chainWebpack((config) => {
    // Add any custom webpack configurations here
    config.resolve.alias.set('@', resolve(__dirname, 'app'));
    
    // Handle .env files
    config.plugin('dotenv')
      .use(require('dotenv-webpack'), [{
        path: resolve(__dirname, '.env'),
        safe: true
      }]);
  });

  return webpack.resolveConfig();
};