const { ModuleFederationPlugin } = require('webpack').container;
const mf = require('@angular-architects/module-federation/webpack');
const path = require('path');

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(path.join(__dirname, 'tsconfig.json'), []);

module.exports = {
  output: {
    uniqueName: 'mfA',
    publicPath: 'auto',
    scriptType: 'text/javascript',
  },
  optimization: {
    runtimeChunk: false,
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    },
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
        './Module': './src/app/exposed/mfa.exposed.ts',
      },
      shared: {
        '@angular/core': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
        '@angular/common': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
        '@angular/forms': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
        '@angular/platform-browser': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
        '@angular/router': { singleton: true, strictVersion: false, requiredVersion: 'auto' },
        rxjs: { singleton: true, strictVersion: false, requiredVersion: 'auto' },
        ...sharedMappings.getDescriptors(),
      },
    }),
    sharedMappings.getPlugin(),
  ],
};
