var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),   
    browserify = require('gulp-browserify'),
    sass = require('gulp-sass'),
    sourcemaps = require("gulp-sourcemaps"),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
     terser = require('gulp-terser'),
     minifyHTML = require('gulp-minify-html'),
    uglify = require('gulp-uglify-es'),
    concat = require('gulp-concat');

    var env,coffeeSources,jsSources,sassSources,
    htmlSources,jsonSources,outputDir,SassStyle;
    
    
   env=process.env.NODE_ENV;
//    env='production';
    gulp.task('launcher', function(cb){
        switch (env){
          case 'production':
            outputDir='builds/production';
            SassStyle='compressed';
            break;
          default :
            outputDir='builds/development';
            SassStyle='expanded';
            break;
        }
        cb();
      });


     


     coffeeSources=['components/coffee/tagline.coffee'];
     jsSources=[
        'components/scripts/rclick.js',
        'components/scripts/pixgrid.js',
        'components/scripts/tagline.js',
        'components/scripts/template.js'
    ];
     sassSources=['components/sass/*.scss'];
     htmlSources=['builds/development/*.html'];
     jsonSources=['builds/development/js/data.json'];

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
    .pipe(gulpif(env==="production",terser()))
    .pipe(gulpif(env==="production",gulp.dest('builds/production/js')))
    .pipe(gulp.dest(outputDir + '/js'))
    .pipe(connect.reload())
    cb();
});

// gulp.task('compass' ,function(cb){
//     gulp.src(sassSources)
//     .pipe(compass({
       
//         sass:'components/sass',
//         images:'outputDir/images',
//         style:'expanded'
        
//     })
//     .on('error',gutil.log))
   
//     .pipe(gulp.dest('outputDir/css'))
//     cb();
    
// });
gulp.task('sass' ,function(cb){
 gulp.src(sassSources)
      .pipe(sourcemaps.init())
      .pipe(sass({
          sourcemap: true,
          style: SassStyle
        }).on("error", sass.logError)
      )
      .pipe(gulp.dest(outputDir +'/css'))
      .pipe(connect.reload())
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
        root: 'builds/development',
        livereload:true,
        port:3000
    });
    cb();
});
gulp.task('html',function(cb){
    gulp.src(htmlSources)
    .pipe(gulpif(env==="production",minifyHTML()))
    .pipe(gulpif(env==="production",gulp.dest(outputDir +'/'+ '/js')))
    .pipe(connect.reload())    
    cb();
});
gulp.task('json',function(cb){
    gulp.src(jsonSources) 
    .pipe(connect.reload())
   cb();   
    
})

 gulp.task('default' ,gulp.series( 'launcher','json','coffee','json' ,'html', 'js' , 'sass', 'watch', 'connect' ));


