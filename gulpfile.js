const del = require('del');
const gulp = require('gulp');

const babel = require('gulp-babel');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

////////////////////////////////////////////////////////////////////////////////

function cleanup() {
	return del('dist');
}

////////////////////////////////////////////////////////////////////////////////

const buildJsSrc = ['src/**/*.js'];
function buildJs() {
	// return gulp.src(buildJsSrc, { since: gulp.lastRun(buildJs) })
	return gulp.src(buildJsSrc)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(concat('eventful.js'))
		.pipe(babel())
		.pipe(gulp.dest('dist'))
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(rename((path) => {
			path.basename += '.min';
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist'));
}
function watchJs() {
	gulp.watch(buildJsSrc, buildJs);
}

const buildScripts = gulp.parallel(buildJs);
const watchScripts = gulp.parallel(watchJs);

////////////////////////////////////////////////////////////////////////////////

const buildStyleCssSrc = ['src/**/*.css'];
function buildStyleCss() {
	return gulp.src(buildStyleCssSrc, { since: gulp.lastRun(buildStyleCss) })
		.pipe(gulp.dest('dist'))
		.pipe(sourcemaps.init())
		.pipe(cleanCss())
		.pipe(rename((path) => {
			path.basename += '.min';
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist'));
}
function watchStyleCss() {
	gulp.watch(buildStyleCssSrc, buildStyleCss);
}

const buildStyleScssSrc = ['src/**/*.scss'];
function buildStyleScss() {
	return gulp.src(buildStyleScssSrc, { since: gulp.lastRun(buildStyleScss) })
		.pipe(sass())
		.pipe(gulp.dest('dist'))
		.pipe(sourcemaps.init())
		.pipe(cleanCss())
		.pipe(rename((path) => {
			path.basename += '.min';
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist'));
}
function watchStyleScss() {
	gulp.watch(buildStyleScssSrc, buildStyleScss);
}

const buildStyles = gulp.parallel(buildStyleCss, buildStyleScss);
const watchStyles = gulp.parallel(watchStyleCss, watchStyleScss);

////////////////////////////////////////////////////////////////////////////////

const buildHtmlSrc = ['src/**/*.html'];
function buildHtml() {
	return gulp.src(buildHtmlSrc, { since: gulp.lastRun(buildHtml) })
		.pipe(gulp.dest('dist'));
}
function watchHtml() {
	gulp.watch(buildHtmlSrc, buildHtml);
}

const buildDocuments = gulp.parallel(buildHtml);
const watchDocuments = gulp.parallel(watchHtml);

////////////////////////////////////////////////////////////////////////////////

exports.default = gulp.series(cleanup, gulp.parallel(buildScripts, buildStyles, buildDocuments));

const watch = gulp.parallel(watchScripts, watchStyles, watchDocuments);
exports.watch = gulp.series(exports.default, watch);

function serve() {
	connect.server({
		livereload: true,
		port: 8080,
		root: '.'
	});
}
exports.serve = gulp.series(exports.default, gulp.parallel(serve, watch));
