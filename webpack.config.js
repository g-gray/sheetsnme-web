'use strict'

const pt = require('path')

const PROD = process.env.NODE_ENV === 'production'

const SRC_DIR        = pt.resolve('src')
const SRC_SCRIPT_DIR = pt.join(SRC_DIR, 'scripts')

const OUT_DIR        = pt.resolve('public')
const OUT_SCRIPT_DIR = pt.join(OUT_DIR, 'scripts')
const PUBLIC_DIR     = pt.resolve('/src/scripts')

module.exports = {
  mode: process.env.NODE_ENV || 'development',

  entry: {
    main: pt.join(SRC_SCRIPT_DIR, '/', 'main.tsx'),
  },

  output: {
    path: OUT_SCRIPT_DIR,
    publicPath: PUBLIC_DIR,
    filename: '[name].js',
    chunkFilename: '[name].js',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        enforce: 'pre',
      },
    ],
  },

  // Don't polyfill any Node globals
  node: false,

  // Source maps require TWO separate options to be enabled:
  //   `devtool: 'source-map'` in webpack config
  //   `sourceMap: true` in tsconfig.json
  devtool: !PROD ? false : 'source-map',

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //   'react': 'React',
  //   'react-dom': 'ReactDOM',
  // },

  // Disable useless logging
  stats: {
    assets: false,
    builtAt: false,
    colors: true,
    entrypoints: false,
    hash: false,
    modules: false,
    timings: true,
    version: false,
  },
}
