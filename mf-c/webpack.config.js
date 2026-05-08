const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = (_env, argv) => {
  const isProduction = argv && argv.mode === 'production';
  const port = 4203;

  return {
    entry: './src/main.single-spa.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
      libraryTarget: 'system',
      publicPath: isProduction ? '/' : `http://localhost:${port}/`,
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue'],
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
    plugins: [new VueLoaderPlugin()],
    externals: ['single-spa', /^@mf\//],
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    devServer: {
      port,
      host: 'localhost',
      historyApiFallback: true,
      hot: false,
      liveReload: false,
      open: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      devMiddleware: {
        writeToDisk: false,
      },
    },
  };
};
