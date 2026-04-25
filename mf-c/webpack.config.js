const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { ModuleFederationPlugin } = require('webpack').container;
const deps = require('./package.json').dependencies;

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: 'auto',
    scriptType: 'text/javascript',
    uniqueName: 'mfC',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
  },
  experiments: {
    outputModule: false,
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new ModuleFederationPlugin({
      name: 'mfC',
      filename: 'remoteEntry.js',
      library: { type: 'var', name: 'mfC' },
      exposes: {
        './Module': './src/app/exposed/mfc.exposed.ts',
      },
      shared: {
        vue: {
          singleton: true,
          strictVersion: false,
          requiredVersion: deps.vue,
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
    port: 4203,
    host: 'localhost',
    hot: true,
    historyApiFallback: true,
    open: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
