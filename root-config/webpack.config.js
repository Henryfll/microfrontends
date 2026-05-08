const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (_env, argv) => {
  const isProduction = argv && argv.mode === 'production';
  const port = 4200;

  return {
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'root-config.js',
      publicPath: isProduction ? '/' : `http://localhost:${port}/`,
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        inject: false,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'node_modules/systemjs/dist/system.min.js'),
            to: 'system.js',
          },
          { from: 'src/styles.css', to: 'styles.css' },
        ],
      }),
    ],
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
