const gulp = require('gulp');
const del = require('del');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const sassLint = require('gulp-sass-lint');
const browserSync = require('browser-sync').create();

gulp.task('scss', function() {
    gulp.src('source/scss/style.scss')
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(postcss([autoprefixer('last 2 versions')]))
        .pipe(gulp.dest('build'))
        .pipe(browserSync.stream());
});

gulp.task('pug', function() {
    gulp.src('source/pug/views/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('build'));
});

gulp.task('lint', function() {
    return gulp.src('source/scss/**/*.scss')
        .pipe(sassLint({
            configFile: './sass-lint.yml'
        }))
        .pipe(sassLint.format());
});

gulp.task('js', function() {
    return gulp.src('source/js/**/*.js')
        .pipe(gulp.dest('build/js'));
});

gulp.task('build', ['lint', 'scss', 'pug', 'js'], function() {
    gulp.src('source/images/*')
        .pipe(gulp.dest('build/images'));

    gulp.src('source/fonts/*')
        .pipe(gulp.dest('build/fonts'));
});

gulp.task('watch', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: './build'
        }
    });

    gulp.watch('source/scss/**/*.scss', ['scss', 'lint']);
    gulp.watch('source/pug/**/*.pug', ['pug']);
    gulp.watch('source/js/**/*.js', ['js']);

    gulp.watch('./build/index.html').on('change', browserSync.reload);
    gulp.watch('./build/js/app.js').on('change', browserSync.reload);
});
