const gulpPostcss = require("gulp-postcss"),
	  autoprefixer = require("autoprefixer"),
	  postcssSimpleVars = require("postcss-simple-vars"),
	  postcssNested = require("postcss-nested"), 
	  postcssMixins = require("postcss-mixins"),
	  postcssImport = require("postcss-import"),
	  hexRgba = require("postcss-hexrgba"),
	  rename = require("gulp-rename"),
	  browserify = require('browserify'),
	  source = require('vinyl-source-stream'),
	  gulp = require('gulp'),
	  // When changing projects these need to be changed:
	  jsSrcFile = './docs/controller/tic-tac-toe-unbundled.js',
	  bundledJsSrcFileName = 'tic-tac-toe-bundled.js',
	  bundledJsSrcFileDest = './docs/controller/',
	  cssSrcFile = "docs/view/css/tic-tac-toe-style.css",
	  bundledCssSrcFileName = 'tic-tac-toe-bundled-style.css',
	  bundledCssSrcFileDest = 'docs/view/css/';

let bundleJavascriptI = 0; 
let bundleCssI = 0; 

gulp.task('bundle-javascript', function() {
	console.log('bundle-javascript cycles: ' + bundleJavascriptI);
	bundleJavascriptI++;
    return browserify(jsSrcFile)
        .bundle()
        .on('error', function(errorInfo){
   		console.log( errorInfo.toString() )
   		this.emit('end');
   		})
        .pipe(source(bundledJsSrcFileName))
        .pipe(gulp.dest(bundledJsSrcFileDest))
});

gulp.task("bundle-css", function(){
	console.log('bundle-css cycles: ' + bundleCssI);
	bundleCssI++;
   	return gulp.src(cssSrcFile)
   	.pipe( gulpPostcss([ postcssImport,autoprefixer({
			browsers: ['last 3 versions'],
			cascade: false
		}),postcssMixins, postcssSimpleVars,hexRgba, postcssNested]) )
   	.on('error', function(errorInfo){
   		console.log( errorInfo.toString() )
   		this.emit('end');
   	})
   	.pipe(rename(bundledCssSrcFileName) )
   	.pipe(gulp.dest(bundledCssSrcFileDest) )
});

gulp.task('default', () => {
	console.log('fut a default i: ' + bundleCssI);
	gulp.watch('./docs/view/css/css-modules/*.css', ['bundle-css']);
	gulp.watch('./docs/view/css/tic-tac-toe-style.css', ['bundle-css']);
	gulp.watch('./docs/controller/tic-tac-toe-unbundled.js', ['bundle-javascript']);
	gulp.watch('./docs/controller/controller-modules/**/*.js', ['bundle-javascript']);
});
