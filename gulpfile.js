/**
 * 组件安装
 * npm install gulp-util gulp-imagemin gulp-less gulp-minify-css gulp-jshint gulp-uglify gulp-rename gulp-concat gulp-clean gulp-livereload tiny-lr gulp-autoprefixer gulp-rev-append gulp-shell amd-optimize fs path browser-sync del --save-dev
 */

// 引入 gulp及组件
var gulp = require('gulp'), //基础库
    imagemin = require('gulp-imagemin'), //图片压缩
    pngquant = require('imagemin-pngquant'),
    smushit = require('gulp-smushit'),
    runSequence = require('run-sequence'), //按顺序执行
    del = require('del');//删除文件
var file_road = {
    imgSrc: './static/img/**/*',
    imgDst: './src/assets',
    img_del:'./src/assets/**/*',
    w_imgSrc: 'static/img/**/*',

    img_new:'./dist/img/**/*',
    img_css:'./dist/css/img/'
};
// 图片处理------------------------------------------------------------------------------------------------------------------------------------------
gulp.task('images', function() {
    gulp.src(file_road.imgSrc)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        // .pipe(smushit({
        //     verbose: true
        // }))//耗时
        .pipe(gulp.dest(file_road.imgDst)); //生成目录
});

// 清空图片、样式、js---最终使用del------------------------------------------------------------------------------------------------------------------------------------------
gulp.task('del', function(cb) {
    del(file_road.img_del, { force: true }, cb);
});

// 监听任务 运行语句 gulp watch------------------------------------------------------------------------------------------------------------------------------------------
gulp.task('watch', function() {
    // 监听images
    gulp.watch(file_road.w_imgSrc, ['images']);
});

//#########################先执行 gulp del  清理文件,再执行gulp编译文件
gulp.task('dev', function(done) {
    runSequence(
        ['images'], ['watch'],
        done);
});
gulp.task('default', ['dev']);
// 复制图片到生成的css文件夹------------------------------------------------------------------------------------------------------------------------------------------
gulp.task('images_copy', function() {
    gulp.src(file_road.img_new)
        .pipe(gulp.dest(file_road.img_css)); 
});