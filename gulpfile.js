// code gulpfile

const gulp = require('gulp');
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const uglifycss = require('gulp-uglifycss');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const sourcemaps = require('gulp-sourcemaps');
const { src, series, paralled, dest, watch, parallel } = require('gulp');
const jsPath = './js/*.js';
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');

function copyhtml() {
    return src('./*.html').pipe(gulp.dest('./dist/'));
}

function imgTask() {
    return src('./images/*').pipe(imagemin()).pipe(gulp.dest('./dist/images'));
}

function csass() {
    return gulp.src('./sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
}

function ccss() {
    return gulp.src('./css/*.css')
        .pipe(uglifycss({
            // "maxLineLen": 80,
            "uglyComments": true
        }))
        .pipe(gulp.dest('./dist/css/'));
}

function jsTask() {
    return src('./js/*.js').pipe(gulp.dest('./dist/js'));
}

function views() {
    return gulp
        .src(['./*.pug'])
        .pipe(
            pug({
                pretty: true,
            }),
        )

        .pipe(gulp.dest('./'))

        .pipe(
            browserSync.reload({
                stream: true,
            })
        );
}

function watchh() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    gulp.watch('./*.pug', views)
    gulp.watch('./sass/*.scss', csass)
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch('./js/*.js').on('change', browserSync.reload);
    gulp.watch('./*.html', copyhtml)
    gulp.watch('./css/*.css', ccss)
    gulp.watch('./js/*.js', jsTask)
}

exports.imgTask = imgTask;
exports.copyhtml = copyhtml;
exports.csass = csass;
exports.ccss = ccss;
exports.jsTask = jsTask;
exports.views = views;
exports.watchh = watchh;
exports.default = parallel(csass, ccss, imgTask, jsTask, views, watchh, copyhtml);