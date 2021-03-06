'use strict';

const gulp = require('gulp'); //+
const doSass = require('gulp-sass'); //+
const minCSS = require('gulp-minify-css'); //+
const uglify = require('gulp-uglify'); //+
const concat = require('gulp-concat'); //+
const rename = require('gulp-rename'); //+
const sourceMaps = require('gulp-sourcemaps'); //+
const debug = require('gulp-debug'); //+
const notify = require('gulp-notify'); //+
const changed = require('gulp-changed'); //+
const sftp = require('gulp-sftp'); //+
const del = require('del'); //+

var hostEx = 'your.host.name';
var userEx = 'your_username';
var passEx = 'yourpassword';

//CSS
//Clean:CSS
gulp.task('clean:CSS', function (){
    return (del(['www/css', 'deploy/css']));
});
//Clean:deploy:CSS
gulp.task('clean:CSS:deploy', function (){
    return (del('deploy/css'));
});
//get_SASS:to:CSS_and_min_CSS:to:min.CSS
gulp.task('SASS:to:minCSS', function() {
    return gulp.src('css_source/**/*.scss')
        .pipe(sourceMaps.init())
        .pipe(debug({title:'initSourceMaps'}))
        .pipe(doSass())
        .pipe(debug({title:'SCSS:to:CSS'}))
        .pipe(minCSS())
        .pipe(rename(function(path){path.extname=".min.css"}))
        .pipe(debug({title:'rename:CSS:to:min.CSS'}))
        .pipe(sourceMaps.write())
        .pipe(debug({title:'writeSourceMaps'}))
        .pipe(gulp.dest('www/css'))
        .pipe(notify('Gulp SASS:to:minCSS successful!'));
});
//Build:CSS
gulp.task('build:CSS', gulp.series('clean:CSS','SASS:to:minCSS'));
//Deploy:CSS_to_remote_server
gulp.task('deploy:CSS', gulp.series('clean:CSS:deploy', function(){
    return gulp.src('www/css/**/*.*')
        .pipe(debug({title:'deploy:CSS'}))
        .pipe(gulp.dest('deploy/css'))
        .pipe(sftp({
            host: hostEx,
            user: userEx,
            pass: passEx,
            remotePath: '/var/www/home/hosting_gkexpo/projects/expert-po/htdocs/css'
        }))
        .pipe(sftp({
            host: hostEx,
            user: userEx,
            pass: passEx,
            remotePath: '/var/www/home/hosting_gkexpo/projects/moscowexpert-po/htdocs/css'
        }))
        .pipe(sftp({
            host: hostEx,
            user: userEx,
            pass: passEx,
            remotePath: '/var/www/home/hosting_gkexpo/projects/spbexpert-po/htdocs/css'
        }))
        .pipe(notify('Gulp deploy:CSS successful!'));
}));

//JS
//Clean:JS
gulp.task('clean:JS', function (){
    return (del(['www/js/**', 'deploy/js/**']));
});
//Clean:deploy:JS
gulp.task('clean:JS:deploy', function (){
    return (del('deploy/js/**'));
});
//Concat:JS
gulp.task('concat:JS', function() {
    return gulp.src('www/js_source/js_concat/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('www/js_source/'))
        .pipe(notify('Gulp concat:JS successful!'));
});
//Uglify:JS_and_rename_JS:to:min.JS
gulp.task('min:JS', function(){
    return gulp.src(['www/js_source/**/*.js',
        '!www/js_source/js_concat/**/*',
        '!www/js_source/deprecated/**/*'])
        .pipe(sourceMaps.init())
        .pipe(debug({title:'initSourceMaps'}))
        .pipe(uglify())
        .pipe(debug({title:'min:JS'}))
        .pipe(rename(function(path){path.extname = ".min.js"}))
        .pipe(debug({title:'rename:JS:to:min.JS'}))
        .pipe(sourceMaps.write())
        .pipe(debug({title:'writeSourceMaps'}))
        .pipe(gulp.dest('www/js/'))
        .pipe(notify('Gulp min:JS successful!'));
});
//Copy_other_files_to:JS
gulp.task('copy:other:JS', function() {
    return gulp.src(['www/js_source/**/*.*',
        '!www/js_source/**/*.js'])
        .pipe(gulp.dest('www/js/'))
        .pipe(debug({title:'copy:other:files:to:JS'}))
        .pipe(notify('Gulp copy:other:JS successful!'));
});
//Build:JS
gulp.task('build:JS', gulp.series('clean:JS','concat:JS','min:JS','copy:other:JS'));
//Deploy:JS_to_remote_server
gulp.task('deploy:JS', gulp.series('clean:JS:deploy', function(){
    return gulp.src('www/js/**/*')
        .pipe(debug({title:'deploy:JS'}))
        .pipe(gulp.dest('deploy/js/'))
        .pipe(sftp({
            host: hostEx,
            user: userEx,
            pass: passEx,
            remotePath: '/var/www/home/hosting_gkexpo/projects/expert-po/htdocs/js'
        }))
        .pipe(sftp({
            host: hostEx,
            user: userEx,
            pass: passEx,
            remotePath: '/var/www/home/hosting_gkexpo/projects/moscowexpert-po/htdocs/js'
        }))
        .pipe(sftp({
            host: hostEx,
            user: userEx,
            pass: passEx,
            remotePath: '/var/www/home/hosting_gkexpo/projects/spbexpert-po/htdocs/js'
        }))
        .pipe(notify('Gulp deploy:JS successful!'));
}));
//IMG
//Deploy_img_to_server
gulp.task('deploy:IMG', function(){
    return gulp.src('www/img/**')
        .pipe(changed('deploy/img/**')) //Добавить_функционал_удаления_удаленных_файлов
        .pipe(gulp.dest('deploy/img/**'))
        .pipe(sftp({
            host: hostEx,
            user: userEx,
            pass: passEx,
            remotePath: '/var/www/home/hosting_gkexpo/projects/expert-po/htdocs/img'
        }))
        .pipe(sftp({
            host: hostEx,
            user: userEx,
            pass: passEx,
            remotePath: '/var/www/home/hosting_gkexpo/projects/moscowexpert-po/htdocs/img'
        }))
        .pipe(sftp({
            host: hostEx,
            user: userEx,
            pass: passEx,
            remotePath: '/var/www/home/hosting_gkexpo/projects/spbexpert-po/htdocs/img'
        }))
        .pipe(debug({title:'deploy:IMG'}))
        .pipe(notify('Gulp deploy:IMG successful!'));
});

//Watch_tasks
gulp.task('watch:CSSJS', function () {
    gulp.watch('www/css_source/**/*.scss', gulp.series('build:CSS'));
    gulp.watch('www/js/**/*.js', gulp.series('build:JS'));
});