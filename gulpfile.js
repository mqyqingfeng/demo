var gulp = require('gulp');
var postcss = require('gulp-postcss'); //postcss
var px2rem = require('postcss-px2rem'); //pxtorem

var path = {
    dirs: {
        src: "css/",
        dev: "css/dist"
    }
};

gulp.task('default', function() {

    var processors = [px2rem({ remUnit: 108 })];

    return gulp.src(path.dirs.src + "index.css")
        .pipe(postcss(processors))
        .pipe(gulp.dest(path.dirs.src))

});