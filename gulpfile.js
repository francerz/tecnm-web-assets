'use strict';

const DIST_PATH = process.env.DIST_PATH || "./dist";

const
    fibers      = require('fibers'),
    gulp        = require('gulp'),
    path        = require('path'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    svgstore    = require('gulp-svgstore');

sass.compiler = require('sass');

gulp.task('compile:style', function() {
    return gulp
        .src('./src/styles/style.scss')
        .pipe(sourcemaps.init())
        .pipe(
            sass.sync({
                fibers: fibers,
                outputStyle: 'compressed'
            }).on('error', sass.logError))
        .pipe(rename({ suffix : '.min' }))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(DIST_PATH));
});
gulp.task('watch:style', function() {
    gulp.watch('./src/styles/**/*.scss', gulp.series('compile:style'));
});

gulp.task('compile:svg', function() {
    gulp
        .src('./src/svg/**/*.svg', { base: './src/graphics' })
        .pipe(rename(function(file) {
            var name = file.dirname.split(path.sep);
            name.push(file.basename);
            file.basename = name.join('-');
        }))
        .pipe(svgstore())
        .pipe(rename({ basename: 'graphics'}))
        .pipe(gulp.dest(DIST_PATH));
});
gulp.task('watch:svg', function() {
    gulp.watch('./src/svg/**/*.svg', gulp.series('compile:svg'));
});

gulp.task('copy:fonts', function() {
    return gulp
        .src('./src/fonts/**/*.*')
        .pipe(gulp.dest(path.join(DIST_PATH, 'fonts')));
});
gulp.task('watch:fonts', function() {
    gulp.watch('./src/fonts/**/*.*', gulp.series('copy:fonts'));
});