const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  output: {
    uniqueName: 'mfA',
    publicPath: 'auto',
    scriptType: 'text/javascript',
  },
  optimization: {
    runtimeChunk: false,
  },
  experiments: {
    outputModule: false,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'mfA',
      filename: 'remoteEntry.js',
      library: { type: 'var', name: 'mfA' },
      exposes: {
        './Module': './src/app/app.ts',
        './Mount': './src/app/mount.ts',
      },
      shared: {
        '@angular/core': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '21.1.0',
        },
        '@angular/common': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '21.1.0',
        },
        '@angular/forms': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '21.1.0',
        },
        '@angular/router': {
          singleton: true,
          strictVersion: true,
          requiredVersion: '21.1.0',
        },
      },
    }),
  ],
};
