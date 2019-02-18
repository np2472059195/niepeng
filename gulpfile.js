var gulp = require('gulp');
var sass = require('gulp-sass');
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var webserver = require('gulp-webserver');
var fs = require('fs');
var path = require('path');
var url = require('url');
gulp.task('scss', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(concat('all.css'))
        .pipe(cleancss())
        .pipe(gulp.dest('./dist'));
})
gulp.task('js', function() {
    return gulp.src('./src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
})
gulp.task('webserver', function() {
    return gulp.src('./src')
        .pipe(webserver({
            port: 3001,
            open: true,
            livereload: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon/ico') {
                    res.end('');
                    return;
                } else {
                    var pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))
})
gulp.task('watch', function() {
    return gulp.watch(['./src/scss/*.scss', './src/js/*.js'], gulp.series(['scss', 'js']))
})
gulp.task('dev', gulp.series(['scss', 'js', 'webserver', 'watch']));