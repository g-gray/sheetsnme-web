'use strict'

require('dotenv').load({path: '.env.properties'})

/**
 * Dependencies
 */

const $ = require('gulp-load-plugins')()
const cp = require('child_process')
const del = require('del')
const gulp = require('gulp')
const log = require('fancy-log')
const st = require('stream')
const {compileTemplate} = require('statil')

/**
 * Globals
 */

const WEBPACK_CONFIG_PATH = './webpack.config.js'

const SRC_STATIC_FILES = 'static/**/*'
const SRC_TEMPLATE_FILES = 'templates/**/*'
const SRC_STYLE_FILES = 'styles/**/*.scss'
const SRC_STYLE_ENTRY = 'styles/main.scss'
const SRC_IMAGES_RASTER = 'images/**/*.{jpg,png,gif}'
// const SRC_IMAGES_VECTOR = 'images/**/*.svg'
const OUT_ROOT_DIR = 'public'
const OUT_STYLE_DIR = 'public/styles'
const OUT_IMAGE_DIR = 'public/images'

const PROD                = process.env.NODE_ENV === 'production'
// const BACKEND_HOST        = process.env.BACKEND_HOST
const LOCAL_PORT          = process.env.LOCAL_PORT

const autoprefixerConfig = {browsers: ['> 1%', 'IE >= 10', 'iOS 7']}

const cssCleanConfig = {
  keepSpecialComments: 0,
  aggressiveMerging: false,
  advanced: false,
  // Don't inline `@import: url()`
  processImport: false,
}

function GulpErr(msg) {return {showStack: false, toString: () => msg}}

function rerequire(path) {
  delete require.cache[require.resolve(path)]
  return require(path)
}

/**
 * Clear
 */

gulp.task('clear', () => (
  del(`${OUT_ROOT_DIR}/*`).catch(console.error.bind(console))
))

/**
 * Static
 */

gulp.task('static:copy', () => (
  gulp.src(SRC_STATIC_FILES).pipe(gulp.dest(OUT_ROOT_DIR))
))

gulp.task('static:watch', () => {
  $.watch(SRC_STATIC_FILES, gulp.series('static:copy'))
})

/**
 * Templates
 */

gulp.task('templates:build', () => {
  const buf = cp.execSync('git rev-parse --short HEAD', {stdio: []})
  const commit = buf.toString().replace(/\n/, '')

  return gulp.src(SRC_TEMPLATE_FILES)
    .pipe(new st.Transform({
      objectMode: true,
      transform(file, __, done) {
        const rendered = compileTemplate(String(file.contents))({
          PROD,
          COMMIT: commit,
        })
        file.contents = Buffer.from(rendered)
        done(undefined, file)
      },
    }))
    .pipe(gulp.dest(OUT_ROOT_DIR))
})

gulp.task('templates:watch', () => {
  $.watch(SRC_TEMPLATE_FILES, gulp.series('templates:build'))
})

/**
 * Scripts
 */

gulp.task('scripts:build', done => {
  buildWithWebpack(require(WEBPACK_CONFIG_PATH), done)
})

gulp.task('scripts:watch', () => {
  let watcher
  function rewatchWithWebpack() {
    if (watcher) watcher.close()
    watcher = watchWithWebpack(rerequire(WEBPACK_CONFIG_PATH))
  }
  rewatchWithWebpack()
  $.watch(WEBPACK_CONFIG_PATH, rewatchWithWebpack)
})

function buildWithWebpack(config, done) {
  require('webpack')(config, (err, stats) => {
    if (err) {
      done(GulpErr(err))
    }
    else {
      log('[webpack]', stats.toString(config.stats))
      done(stats.hasErrors() ? GulpErr('webpack error') : undefined)
    }
  })
}

function watchWithWebpack(config) {
  const compiler = require('webpack')(config)
  const watcher = compiler.watch({}, (err, stats) => {
    log('[webpack]', stats.toString(config.stats))
    if (err) log('[webpack]', err.message)
  })
  return watcher
}

/**
 * Styles
 */

gulp.task('styles:build', () => (
  gulp.src(SRC_STYLE_ENTRY)
    .pipe($.sass())
    .pipe($.autoprefixer(autoprefixerConfig))
    .pipe(!PROD ? new st.PassThrough({objectMode: true}) : $.cleanCss(cssCleanConfig))
    .pipe(gulp.dest(OUT_STYLE_DIR))
))

gulp.task('styles:watch', () => {
  $.watch(SRC_STYLE_FILES, gulp.series('styles:build'))
})

/**
 * Images
 */

gulp.task('images:raster', () => (
  gulp.src(SRC_IMAGES_RASTER)
    // Requires `graphicsmagick` or `imagemagick`. Install via Homebrew or
    // the package manager of your Unix distro.
    .pipe($.imageResize({quality: 1, width: 1920}))
    .pipe(gulp.dest(OUT_IMAGE_DIR))
))

// gulp.task('images:vector', () => (
//   gulp.src(SRC_IMAGES_VECTOR)
//     .pipe($.svgo())
//     .pipe(gulp.dest(OUT_IMAGE_DIR))
// ))

// gulp.task('images:build', gulp.parallel('images:raster', 'images:vector'))
gulp.task('images:build', gulp.parallel('images:raster'))

gulp.task('images:watch', () => {
  $.watch(SRC_IMAGES_RASTER, gulp.series('images:raster'))
  // $.watch(SRC_IMAGES_VECTOR, gulp.series('images:vector'))
})

/**
 * Server
 */

gulp.task('server', () => {
  const proxy = require('http-proxy').createProxyServer()

  proxy.on('error', (err, req, res) => {
    if (err.code === 'ECONNRESET') return
    log('[proxy error]', err)
    res.setHeader('content-type', 'application/json')
    res.writeHead(500)
    res.end(JSON.stringify(Object.assign({message: err.message}, err)))
  })

  require('browser-sync').create().init({
    startPath: '/',
    port: LOCAL_PORT,
    files: OUT_ROOT_DIR,
    serveStatic: [OUT_ROOT_DIR],
    serveStaticOptions: {
      extensions: ['html'],
    },
    server: {
      baseDir: OUT_ROOT_DIR,
      middleware: [
        (req, res, next) => {
          const backend = BACKEND_HOST + '/'

          if (/^\/(?:api|auth)\//.test(req.url)) {
            proxy.web(req, res, {target: backend, secure: false})
          }
          else {
            next()
          }
        },

        (req, res, next) => {
          // No dot in pathname -> probably not a file request, use fallback
          if (!/^[^?#]*[.]/.test(req.url)) req.url = '/index.html'
          next()
        },
      ],
    },
    open: false,
    online: false,
    ui: false,
    ghostMode: false,
    notify: false,
  })
})

/**
 * Default
 */

gulp.task('buildup', gulp.parallel(
  'static:copy',
  'templates:build',
  'styles:build',
  'images:build',
))

gulp.task('watch', gulp.parallel(
  'static:watch',
  'templates:watch',
  'styles:watch',
  'images:watch',
  'scripts:watch',
  'server',
))

gulp.task('build', gulp.series('clear', gulp.parallel(
  'buildup',
  'scripts:build',
)))

gulp.task('default', gulp.series('clear', gulp.series('buildup', 'watch')))
