const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: 'auto',
    scriptType: 'text/javascript',
    clean: true,
  },
  optimization: {
    runtimeChunk: false,
  },
  experiments: {
    outputModule: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remoteType: 'script',
      remotes: {
        mfa: 'mfA@http://localhost:4201/remoteEntry.js',
        mfb: 'mfB@http://localhost:4202/remoteEntry.js',
        mfc: 'mfC@http://localhost:4203/remoteEntry.js',
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 4200,
    host: 'localhost',
    hot: true,
    historyApiFallback: true,
    open: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
