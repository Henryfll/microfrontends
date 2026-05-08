const path = require('path');

module.exports = (_env, argv) => {
  const isProduction = argv && argv.mode === 'production';
  const port = 4202;

  return {
    entry: './src/main.single-spa.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
      libraryTarget: 'system',
      publicPath: isProduction ? '/' : `http://localhost:${port}/`,
      clean: true,
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
