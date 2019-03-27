'use strict'

const pt = require('path')

const PROD                   = process.env.NODE_ENV === 'production'
const SCRIPT_DIR             = pt.resolve('scripts')
const OUT_DIR                = pt.resolve('public/scripts')
const PUBLIC_DIR             = pt.join(pt.resolve('/scripts'), '/')

module.exports = {
  mode: process.env.NODE_ENV || 'development',

  entry: {
    main: pt.join(SCRIPT_DIR, 'main.js'),
  },

  output: {
    path: OUT_DIR,
    publicPath: PUBLIC_DIR,
    filename: '[name].js',
    chunkFilename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: SCRIPT_DIR,
        use: {loader: 'babel-loader', options: babelOptions()},
      },
    ],
  },

  // Don't polyfill any Node globals
  node: false,

  plugins: [
    /*
    Module concatenation merges modules together without intermediary IIFE
    wrappers, renaming variables and functions with conflicting names. Unused
    exports are left as dangling variable declarations and can be eliminated by
    minification. This is often called "tree shaking".

    NOTE: Babel's transformation of the `...` spread syntax can interfere with
    this feature in a hard-to-detect way. Suppose we're calling a function from
    another module that was star-imported as a namespace. The call looks like
    this: `mod.fun(...args)`. Babel produces `fun.apply(mod, args)`, causing
    Webpack to materialize the module, preventing tree shaking. We can't simply
    disable the spread transform: Webpack and Uglify can also parse the spread
    syntax, and will NOT warn us about shipping non-ES5 code to the users.
    Instead, we must avoid this feature and use `.apply`. Note that the problem
    pertains only to function calls.
    */
    // new (require('webpack').optimize.ModuleConcatenationPlugin)(),
  ],

  optimization: !PROD ? undefined : {
    minimize: true,
    minimizer: [
      // Override defaults to remove useless library comments.
      new (require('uglifyjs-webpack-plugin'))({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          mangle: {toplevel: true},
          compress: {warnings: false},
          output: {comments: false},
        },
      }),
    ],
  },

  // optimization: {minimize: false, minimizer: []},
  // performance: {hints: false},

  // Source maps require TWO separate options to be enabled:
  //   `devtool: 'source-map'` in webpack config
  //   `sourceMap: true` in uglify plugin options
  devtool: !PROD ? false : 'source-map',

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

function babelOptions() {
  return {
    presets: [
      ['@babel/preset-env', {
        targets: {browsers: ['> 1%']},
        // Keep ES modules for Webpack
        modules: false,
        // Don't generate useless garbage
        loose: true,
      }],
    ],
    plugins: [
      // Emits a special annotation just before a class-defining IIFE, marking
      // it as side-effect-free. Allows UglifyJS to remove unused classes
      // generated from our code by Babel. Doesn't affect library code. Must
      // precede other class transforms. May require module concatenation.
      // References:
      //   * https://github.com/mishoo/UglifyJS2/issues/1261
      //   * https://github.com/babel/babel/issues/5632
      //   * https://github.com/babel/babel/pull/6209
      //   * https://github.com/blacksonic/babel-webpack-tree-shaking
      () => ({
        visitor: {
          ClassExpression(path) {
            path.addComment('leading', '#__PURE__')
          },
        },
      }),
      '@babel/transform-react-jsx',
      '@babel/plugin-proposal-class-properties',
    ],
  }
}
