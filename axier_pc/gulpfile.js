var gulp = require('gulp'),                             //源码包
    rename = require('gulp-rename'),                    //重命名
    browserSync = require('browser-sync').create();     //浏览器自动刷新
    watch = require('gulp-watch'),                      //监听文件修改
    cssver = require('gulp-make-css-url-version'),      //css里外链文件资源添加版本
    autoprefixer = require('gulp-autoprefixer'),        //css语法兼容性处理
    htmlmin = require('gulp-htmlmin'),                  //压缩html
    cssmin = require('gulp-cssmin'),                    //css压缩
    uglify = require('gulp-uglify'),                    //js压缩
    imagemin = require('gulp-imagemin'),                //图片压缩
    plumber = require('gulp-plumber'),                  //处理流程冲突
    rev = require('gulp-rev-all'),                      //全局文件添加版本
    filter = require('gulp-filter'),                    //文件过滤
    htmltpl = require('gulp-html-tpl'),                 //html模板
    artTemplate = require('art-template'),              //artTemplate模板引擎
    gulpIf = require('gulp-if'),                        //文件判断
    print = require('gulp-print').default,              //文件流调试输出
    concat = require('gulp-concat'),                    //文件合并
    inject = require('gulp-inject'),                    //文件注入
    less = require('gulp-less'),                        //less文件编译
    del = require('del')                                //文件、文件夹删除                  

/**
 * 前端工作流
 */
gulp.task('include',function(){
  var styleFilter = filter(['src/static/style/**/*.css','src/static/style/**/*.less'], {restore: true}),
      jsFilter = filter(['src/static/js/**/*.js'],{restore: true}),
      htmlFilter = filter(['src/**/*.html'],{restore: true}),
      imageFilter = filter(['src/static/**/*.jpg','src/static/**/*.png','src/static/**/*.jpeg','src/static/**/*.gif','src/static/**/*.ico'],{restore:true})
      // 判断文件流是否含有某个类型的文件
      // condition = function(file){
      //   if(file.path.indexOf('.png') > 0 || file.path.indexOf('.jpg') > 0 || file.path.indexOf('.svg') > 0){
      //     return false
      //   }
      //   return true
      // }

      // 判断文件流是否含有某个文件夹
      imageDir = function(file){
        if(file.path.indexOf('images') > 0){
          return false
        }
        return true
      }

      jsDir = function(file){
        console.log(file.path)
        if(file.path.indexOf('js/') > 0){
          return false
        }
        return true
      }
  
  return gulp.src(['src/**/*','!src/**/template/*','!src/**/template'])
      .pipe(plumber())
      .pipe(styleFilter)
      .pipe(less())
      .pipe(cssver())
      .pipe(autoprefixer({
          browsers: [
            "> 1%",
            "last 7 versions",
            "not ie <= 8",
            "ios >= 8",
            "android >= 4.0"
          ],
          cascade: false
      }))
      // .pipe(concat('static/css/all.css'))
      // .pipe(cssmin())
      // .pipe(rename({suffix: '.min'}))
      .pipe(styleFilter.restore)
      // .pipe(jsFilter)
      // .pipe(concat('static/js/all.js'))
      // .pipe(uglify())
      // .pipe(rename({suffix: '.min'}))
      // .pipe(jsFilter.restore)
      // .pipe(htmlFilter)
      // .pipe(htmlmin({
      //   removeComments: true,//清除HTML注释
      //   collapseWhitespace: true,//压缩HTML
      //   collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
      //   removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
      //   removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
      //   removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
      //   minifyJS: true,//压缩页面JS
      //   minifyCSS: true//压缩页面CSS
      // }))
      // .pipe(htmlFilter.restore)
      // .pipe(imageFilter)
      // .pipe(imagemin({
      //   optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      //   progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      //   interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      //   multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
      // }))
      // .pipe(imageFilter.restore)
      // .pipe(gulpIf(condition,include({
      //     prefix:'@',
      //     basepath:'@file',
      //     context:{
      //       webTitle:'埃西尔',
      //       static:'./static',
      //     }
      // })))
      .pipe(htmlFilter)
      .pipe(htmltpl({
        tag: 'Component',
        // paths: ['template/'],
        engine: function(template, data) {
          return artTemplate.compile(template)(data)
        },
        data: {
          webTitle:'埃西尔',
          static:'./static',
        },
        beautify: {
          indent_char: ' ',
          indent_with_tabs: false
        }
      }))
      .pipe(htmlFilter.restore)
      .pipe(rev.revision({                                       // 生成版本号(解决静态资源缓存问题)
        dontRenameFile: ['.html','.png','.jpg','.svg','.json'],          // 不给XX文件添加版本号
        dontUpdateReference: ['.html','.png','.jpg','.svg','.json']      // 不给文件里链接的XX文件加版本号
      }))
      .pipe(gulp.dest('dist'))
      // .on('end',() => {                                       // 需要全局公共文件注入时打开
      //     var sources = gulp.src(['dist/**/*.js', 'dist/**/*.css'], {read: false});
      //     gulp.src('dist/**/*.html')
      //         .pipe(inject(sources,{relative:true}))
      //         .pipe(gulp.dest('dist'))
      // })
      // .pipe(connect.reload())
      .pipe(browserSync.reload({stream: true}))
})

/**
 * 编译
 */
gulp.task('resolve',function(){
    // del(['dist']).then(()=>{
    //   gulp.start('include')
    // })
    gulp.start('include')
})


/**
 * 批量压缩图片
 */
gulp.task('imagemin',function(){
  return gulp.src(['src/**/*.{jpg,png,jpeg,gif,ico}'])
    .pipe(imagemin({
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
    }))
    .pipe(gulp.dest('dist'))
})

/**
 * 开启开发模式
 */
gulp.task('dev',function(){                                          
    browserSync.init({
      server: "dist",
      port:8080
    });
    gulp.start('include')
    return watch('./src/**/*',function(){
        console.log('task update...')
        gulp.start('resolve')
    })
})