'use strict'

var gulp = require('gulp');
var util = require('gulp-util');
var docker = require('gulp-docker');
var gif = require('gulp-if');
var path = require('path');
var yargs = require('yargs');
var del = require('del');

var options = {
      sourceFolder : '../src/code-set-service/',
      target:'latest/app',
      debugTarget:'debug/app'
}

var paths = [options.sourceFolder +'package.json',
             options.sourceFolder + '**/*.yaml',
             options.sourceFolder + '**/*.js',
            "!" + options.sourceFolder + 'tests/**',
            "!" + options.sourceFolder + 'node_modules/**'];

new docker(gulp, {
    "latest" : {
        dockerfile: "./latest",
        tags: ['latest'],
        repo: "upmc-isd-eti/esb-code-set-api",
        name:"upmc-isd-eti/esb-code-set-api"
    },
    "debug":{
        dockerfile:"./debug",
        tags: ['debug'],
        name:"upmc-isd-eti/esb-code-set-api-debug"
    }
});

gulp.task('clean', function(){
    util.log("Running clean........")
    del([options.target, options.debugTarget]);
});

gulp.task('copy', function(){
    util.log("Copying source ........");
    return gulp.src(paths)
              .pipe(gulp.dest(options.target + "/"))
              .pipe(gulp.dest(options.debugTarget + "/"));
});

gulp.task('clone', ['clean', 'copy']);

gulp.task('default', ['clone', 'docker:image', 'clean']);
