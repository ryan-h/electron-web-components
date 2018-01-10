"use strict";

const gulp = require("gulp");
const ts = require("gulp-typescript");
const sass = require("gulp-sass");
const sassLint = require("gulp-sass-lint");
const gulpTslint = require("gulp-tslint");
const tslint = require("tslint");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const gulpFilter = require("gulp-filter");

/**
 * Lint the Typescript files used in the app.
 */
gulp.task("lint:ts", () => {
    const filter = gulpFilter(["**/*.ts", "!**/node_modules/**/*.ts"]);
    const program = tslint.Linter.createProgram("tsconfig.json");

    gulp.src("./app/**/*.ts")
        .pipe(filter)
        .pipe(gulpTslint({ program }))
        .pipe(gulpTslint.report({
            emitError: false
        }));
});

/**
 * Compile the TypeScript.
 */
gulp.task("compile:ts", ["lint:ts"], () => {
    const tsProject = ts.createProject("tsconfig.json", {
        typescript: require("typescript"),
        rootDir: "./"
    });

    return tsProject.src()
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(tsProject(ts.reporter.defaultReporter()))
        .js.pipe(sourcemaps.write(".", {
            includeContent: false,
            sourceRoot: `${__dirname}\\`
        }))
        .pipe(gulp.dest(tsProject.config.compilerOptions.outDir || "./"));
});

/**
 * Clean the compiled css files.
 */
gulp.task("clean:sass", () => {
    return del(["./app/renderer/styles/*.css", "./app/renderer/web-components/**/*.css"]);
});

/**
 * Lint the sass files used in the app.
 */
gulp.task("lint:sass", () => {
    return gulp.src("./app/**/*.s+(a|c)ss")
        .pipe(sassLint({
            configFile: "sass-lint.yml"
        }))
        .pipe(sassLint.format());
});

/**
 * Compile the app styles.
 */
gulp.task("compile:sass:main", ["lint:sass", "clean:sass"], () => {
    return gulp.src("./app/renderer/styles/*.s+(a|c)ss")
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(gulp.dest("./app/renderer/styles"));
});

/**
 * Compile the web component styles.
 */
gulp.task("compile:sass:components", ["lint:sass", "clean:sass"], () => {
    return gulp.src("./app/renderer/web-components/**/*.s+(a|c)ss")
        .pipe(sass({ outputStyle: "compressed", includePaths: ["./app/renderer/styles"] }).on("error", sass.logError))
        .pipe(gulp.dest("./app/renderer/web-components"));
});

/**
 * Compile the sass.
 */
gulp.task("compile:sass", ["compile:sass:main", "compile:sass:components"]);

/**
 * Build the application.
 */
gulp.task("default", ["compile:ts", "compile:sass"], null);
