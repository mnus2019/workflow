var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),   
    browserify = require('gulp-browserify'),
    sass = require('gulp-sass'),
    sourcemaps = require("gulp-sourcemaps"),
    connect = require('gulp-connect'),
    concat = require('gulp-concat');

    var coffeeSources=['components/coffee/tagline.coffee'];
    var jsSources=[
        'components/scripts/rclick.js',
        'components/scripts/pixgrid.js',
        'components/scripts/tagline.js',
        'components/scripts/template.js'
    ];
    var sassSources=['components/sass/*.scss'];
    var htmlSources=['builds/development/*.html'];
    var jsonSources=['builds/development/js/*.json'];

gulp.task('coffee' ,function(cb) {
    gulp.src('components/coffee/tagline.coffee')
    .pipe(coffee({ bare:true})
    .on('error',gutil.log))
    .pipe(gulp.dest('components/scripts'))
    cb();
});

gulp.task('js' ,function(cb){
    gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
    .pipe(connect.reload())
    cb();
});

// gulp.task('compass' ,function(cb){
//     gulp.src(sassSources)
//     .pipe(compass({
       
//         sass:'components/sass',
//         images:'builds/development/images',
//         style:'expanded'
        
//     })
//     .on('error',gutil.log))
   
//     .pipe(gulp.dest('builds/development/css'))
//     cb();
    
// });
gulp.task('sass' ,function(cb){
 gulp.src(sassSources)
      .pipe(sourcemaps.init())
      .pipe(sass({
          sourcemap: true,
          style: "expanded"
        }).on("error", sass.logError)
      )
      .pipe(gulp.dest('builds/development/css'));
      cb();
    });

gulp.task('watch', function(cb){
    gulp.watch(coffeeSources, gulp.series('coffee'));
    gulp.watch(jsSources, gulp.series('js'));
    gulp.watch(htmlSources, gulp.series('html'));
    gulp.watch(jsonSources, gulp.series('json'));
    gulp.watch('components/sass/*.scss', gulp.series('sass'));
    cb();
});
gulp.task('connect',function(cb){
    connect.server({
        root:'builds/development',
        livereload:true,
        port:3000
    });
    cb();
});
gulp.task('html',function(cb){
    gulp.src(htmlSources)
    .pipe(connect.reload())
    cb();
});
gulp.task('json',function(cb){
    gulp.src(jsonSources)
    .pipe(connect.reload())
    cb();
})

 gulp.task('default' ,gulp.series( 'coffee','json' ,'html', 'js' , 'sass', 'watch', 'connect' ));


