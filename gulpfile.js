
var gulp            = require('gulp')
,   _               = require('lodash')
,   path            = require('path')
,   sass            = require('gulp-sass')
,   autoprefix      = require('gulp-autoprefixer')
,   sourcemaps      = require('gulp-sourcemaps')
,   rename          = require('gulp-rename')
,   concat          = require('gulp-concat')
,   uglify          = require('gulp-uglify')
,   todo            = require('gulp-todo')
,   s3              = require('gulp-s3-upload')
,   livereload      = require('gulp-livereload')
// ,    rjs             = require('gulp-requirejs')
//  Custom Tasks / Gulp utilities
,   gconf           = require('./tasks/gulpconfig.js')
,   quickBundle     = require('./tasks/quick-bundle.js')
;

gulp.task('default', ['sass', 'qb']);

gulp.task('watch', ['default'], function() {
    livereload.listen();

    gulp.watch('./scss/**/*.scss', ['sass']).on('change', livereload.reload);
    gulp.watch('./public/**/*').on('change', livereload.reload);
    gulp.watch('./src/**/*.js', ['qb']).on('change', livereload.reload);
    gulp.watch('./views/**/*.nunjs').on('change', livereload.reload);
});

//  ********** sass **************************** //


gulp.task('sass', ['sass.dev', 'sass.min']);

gulp.task('sass.dev', function() {
    return gulp.src(gconf.Sass.src)
        .pipe(sass(gconf.Sass.opts).on('error', sass.logError))
        .pipe(autoprefix({
            'cascade': true,
            'remove': true
        }))
        .pipe(gulp.dest(gconf.Sass.dest))
    ;
});

function renameSassSourcemaps(map_file_path) {
    return map_file_path.replace(".min.css", ".map");
}

gulp.task('sass.min', function () {
    var new_opts = _.extend({
        outputStyle: 'compressed'
    }, gconf.Sass.opts);

    return gulp.src(gconf.Sass.src)
        .pipe(sourcemaps.init())
        .pipe(sass(new_opts).on('error', sass.logError))
        .pipe(autoprefix({
            'remove': true
        }))
        .pipe(rename({'extname': '.min.css'}))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(gconf.Sass.dest))
    ;
});

gulp.task('qb', ['js.qb', 'js.qb.min']);

//  ********** JS - QUICK BUNDLE *************** //

gulp.task('js.bundle', ['qb']);

gulp.task('js.qb', function() {
    return gulp.src(gconf.jsqb.src)
        .pipe(quickBundle())
        .pipe(rename({ 'extname': '.js' }))
        .pipe(gulp.dest(gconf.jsqb.dest))
    ;
});

gulp.task('js.qb.min', function() {
    return gulp.src(gconf.jsqb.src)
        .pipe(quickBundle())
        .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(rename({'extname': '.min.js'}))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(gconf.jsqb.dest))
    ;
});

//  ********** UPLOAD to S3 ********************** //
//  Only uploads, does not mirror files.

gulp.task('upload', function() {
    return gulp.src(gconf.S3.src)
        .pipe(s3({
            'Bucket':   gconf.s3.Bucket
        ,   'ACL':      'public-read'
        ,   'keyTransform': function(rel) {
                return path.normalize(gconf.S3.prefix + "/" + rel);
            }
        }))
    ;
});


//  ********** xTODOx **************************** //

function todoTransformHeader(kind) {
    return [
        '##' + kind + "s"
    ];
}

function todoTransformComment(file, line, text, kind) {
    return [
        "*  `" + file + " @ " + line + ":`"+ text
    ];
}

gulp.task('todo.sass', function() {
    return gulp.src('./sass/**/*.sass')
        .pipe(todo({'fileName': gconf.Todo.prefix + 'sass.md'}))
        .pipe(todo.reporter('markdown', {
            'fileName': gconf.Todo.prefix + 'sass.md',
            'transformComment': todoTransformComment,
            'transformHeader': todoTransformHeader
        }))
        .pipe(gulp.dest(gconf.Todo.docs))
        .pipe(todo.reporter('json', { fileName: 'todo-sass.json' }))
        .pipe(gulp.dest(gconf.Todo.json))
    ;
});

gulp.task('todo.app', function() {
    return gulp.src('./src/**/*.js')
        .pipe(todo({'fileName': gconf.Todo.prefix + 'app.md'}))
        .pipe(todo.reporter('markdown', {
            'fileName': gconf.Todo.prefix + 'app.md',
            'transformComment': todoTransformComment,
            'transformHeader': todoTransformHeader
        }))
        .pipe(gulp.dest(gconf.Todo.docs))
        .pipe(todo.reporter('json', { fileName: 'todo-app.json' }))
        .pipe(gulp.dest(gconf.Todo.json))
    ;
});

gulp.task('todo.server', function() {
    return gulp.src([
            './*.js'
        ,   './routes/**/*.js'
        ,   './libs/**/*.js'
        ])
        .pipe(todo({'fileName': gconf.Todo.prefix + 'server.md'}))
        .pipe(todo.reporter('markdown', {
            'fileName': gconf.Todo.prefix + 'server.md',
            'transformComment': todoTransformComment,
            'transformHeader': todoTransformHeader
        }))
        .pipe(gulp.dest(gconf.Todo.docs))
        .pipe(todo.reporter('json', { fileName: 'todo-server.json' }))
        .pipe(gulp.dest(gconf.Todo.json))
    ;
});

gulp.task('todo', ['todos']);
gulp.task('todos', ['todo.less', 'todo.app', 'todo.server']);