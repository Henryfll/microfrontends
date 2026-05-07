const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: 'auto',
    scriptType: 'text/javascript',
    uniqueName: 'mfB',
    clean: true,
  },
  optimization: {
    runtimeChunk: false,
  },
  experiments: {
    outputModule: false,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfB',
      filename: 'remoteEntry.js',
      library: { type: 'var', name: 'mfB' },
      exposes: {
        './Module': './src/app/App.tsx',
        './Mount': './src/app/mount.tsx',
      },
      shared: {
        react: {
          singleton: true,
          strictVersion: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          strictVersion: true,
          requiredVersion: deps['react-dom'],
        },
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
    port: 4202,
    host: 'localhost',
    hot: true,
    historyApiFallback: true,
    open: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
