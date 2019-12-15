const del = require('del');
const gulp = require('gulp');

const babel = require('gulp-babel');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const injectString = require('gulp-inject-string');
const removeCode = require('gulp-remove-code');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

const pkg = require('./package.json');

function cleanup() {
	return del(['dist', 'temp']);
}
function buildJs_es6_individual() {
	return gulp.src('src/**/*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(gulp.dest('temp'))
		.pipe(gulp.dest('dist'));
}

function buildJs_es6_merge() {
	return gulp.src('temp/**/*.js')
		.pipe(removeCode({ merge: true }))
		.pipe(concat(`${pkg.name}.js`))
		.pipe(injectString.prepend(`window.${pkg.name} = window.${pkg.name} || {};\n\n`))
		.pipe(gulp.dest('temp'))
		.pipe(gulp.dest('dist'));
}

function buildJs_es5() {
	return gulp.src('temp/**/*.js')
		.pipe(babel())
		.pipe(rename((path) => {
			path.basename += '.es5';
		}))
		.pipe(gulp.dest('dist'));
}

function buildJs_minify() {
	return gulp.src('dist/**/*.js')
		.pipe(uglify())
		.pipe(rename((path) => {
			path.basename += '.min';
		}))
		.pipe(gulp.dest('dist'));
}

const buildJs = gulp.series(buildJs_es6_individual, buildJs_es6_merge, buildJs_es5, buildJs_minify);

const build = gulp.parallel(buildJs);

exports.default = gulp.series(cleanup, build);
