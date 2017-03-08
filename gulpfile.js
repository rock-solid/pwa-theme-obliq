'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const bower = require('bower');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const minifyCss = require('gulp-minify-css');
const rename = require('gulp-rename');
const sh = require('shelljs');
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const eslint = require('gulp-eslint');
const jsdoc = require('gulp-jsdoc3');
const ngdoc = require('gulp-ngdocs');
const karma = require('karma');
const pump = require('pump');
const uglify = require('gulp-uglify');
const htmlreplace = require('gulp-html-replace');


const templateCache = require('gulp-angular-templatecache');
const inlineFonts = require('gulp-inline-fonts');
const progeny = require('gulp-progeny');

let paths = {
  sass: ['./src/**/*.scss']
};

gulp.task('default', ['compilejs', 'minify-html', 'sass', 'copy-assets']);

gulp.task('production', () => {
  pump([
    gulp.src('www/index.html'),
    htmlreplace({
      js: ['dist/bundle.js'],
      css: ['dist/bundle.css']
    }),
    gulp.dest('www')
  ]);
});

gulp.task('production-js', ['prepare-templates', 'uglify']);
gulp.task('production-css', ['prepare-fonts', 'concat-css']);
gulp.task('production-scss', ['export-custom-scss-paths','build-custom-sass']);

gulp.task('prepare-templates', (callback) => {
  pump([
    gulp.src('www/app/**/*.html'),
    templateCache('templates.production.js', {
      module: 'appticles',
      root: 'app',
    }),
    uglify(),
    gulp.dest('www/app')
  ],
    callback
  );
});

gulp.task('uglify', ['prepare-templates'], (callback) => {
  pump([
    gulp.src([
      'www/lib/ionic/js/ionic.bundle.js',
      'www/lib/angular-translate/angular-translate.js',
      'www/lib/ngDfp/angular-dfp.js',
      // and any other third-party modules

      'www/app/app.module.js',

      'www/app/**/*.module.js',
      'www/app/**/*.service.js',
      'www/app/**/*.config.js',
      'www/app/**/*.filter.js',
      'www/app/**/*.controller.js',
      'www/app/**/*.directive.js',
      'www/app/**/*.provider.js',

      'www/app/main.js',

      'www/app/templates.production.js',
    ]),
    uglify(),
    concat('bundle.js'),
    gulp.dest('www/dist')
  ],
    callback
  );
});

gulp.task('prepare-fonts', (cb) => {
  pump([
    gulp.src('www/assets/fonts/*.*'),
    inlineFonts({
      name: 'Ionicons',
      formats: ['woff', 'woff2', 'eot', 'ttf', 'svg']
    }),
    gulp.dest('www/dist/')
  ],
    cb
  );
});

gulp.task('concat-css', ['prepare-fonts'], () => {
  pump([
    gulp.src(['www/dist/Ionicons.css', 'www/assets/sass/ionic.app.min.css', 'www/assets/sass/main.min.css']),
    concat('bundle.css'),
    gulp.dest('www/dist')
  ]);
});

gulp.task('export-custom-scss-paths', () => {

  var progenyConfig = {
    // Array of multiple file extensions to try when looking for dependencies
    extensionsList: ['scss', 'sass'],

    // Regexp to run on each line of source code to match dependency references
    // Make sure you wrap the file name part in (parentheses)
    regexp: /^\s*@import\s+['"]?([^'"]+)['"]?/,

    // File prefix to try (in addition to the raw value matched in the regexp)
    prefix: '_',

    // Matched stuff to exclude: string, regex, or array of either/both
    exclusion: /^compass/,

    // which file to find when import directory as a whole
    // don't include extension here
    // e.g. @import 'blueprint' is expanded to @import 'blueprint/index.styl'
    // directoryEntry: 'index',

    // In case a match starts with a slash, the absolute path to apply
    // rootPath: path.join('path', 'to', 'project'),
    rootPath: './',

    // all dependencies will be printed out in debug mode
    debug: true
  };

  let pathsArray = [];


  pump([gulp.src(['www/assets/sass/customizable.scss']),
    progeny(progenyConfig)
  ]);
});

gulp.task('build-custom-sass', function () {

  let orderedPaths = require('./customizableSass-paths.json').paths;

  pump ([
    gulp.src(orderedPaths),
    concat('customizable.scss'),
    gulp.dest('www/dist')
  ]);
});

const runTests = (options, done) => {
  new karma.Server({
    configFile: `${__dirname}/karma.conf.js`,
    singleRun: options.singleRun
  }, done).start();
};
gulp.task('test', (done) => runTests({ singleRun: true }, done));

gulp.task('test:watch', (done) => runTests({ singleRun: false }, done));

gulp.task('copy-assets', () => {
  gulp.src([
    './src/**/*.json',
  ]).pipe(gulp.dest('./www'));
  gulp.src([
    './src/assets/**/*'
  ]).pipe(gulp.dest('./www/assets'));
});

gulp.task('lint', () => {
  return gulp.src(['./src/**/*.js'])
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('jsdoc', () => {
  return gulp.src(['./src/**/*.js'])
    .pipe(jsdoc('./documentation'));
});

gulp.task('ngdoc', () => {
  return gulp.src(['./src/**/*.js'])
    .pipe(ngdoc.process())
    .pipe(gulp.dest('./docs'));
});

gulp.task('minify-html', () => {
  gulp.src([
    './src/**/*.html',
    '!./src/lib/**/*'
  ])
    .pipe(htmlmin({
      collapseWhitespace: true,
      collapseBooleanAttributes: true
    }))
    .pipe(gulp.dest('./www/'));
});

gulp.task('compilejs', ['lint'], () => {
  gulp.src([
    './src/**/*.js',
    '!./src/lib/**/*'
  ])
    .pipe(babel({
      presets: [
        'es2015',
        'stage-2'
      ]
    }))
    .pipe(gulp.dest('./www/'));
});

gulp.task('sass', (done) => {
  gulp.src('./src/**/*.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('add-bundle-to-html', () => {
  pump([
    gulp.src('www/index.html'),
    htmlreplace({
      js: 'dist/bundle.js'
    }),
    gulp.dest('www')
  ]);
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*', ['default']);
});

gulp.task('install', ['git-check'], () => {
  return bower.commands.install()
    .on('log', (data) => {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', (done) => {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
