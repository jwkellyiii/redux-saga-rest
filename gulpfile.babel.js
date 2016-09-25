import * as path from 'path';
import gulp from 'gulp';
import glob from 'glob';
import gutil from 'gulp-util';
import runSequence from 'run-sequence';
import webpack from 'webpack';
import {spawn} from 'child_process';

import { default as webpackConfig, webpackStats } from './webpack.config.babel';

gulp.task('default', (cb) => {
    runSequence('clean', 'webpack', cb);
});

gulp.task('clean', (cb) => {
    glob(path.join(__dirname, 'dist/*'), (err, files) => {
        if (files.length > 0) {
            spawn('rm', ['-r'].concat(files), {stdio: 'inherit'}).on('exit', cb);
        } else {
            cb();
        }
    });
});

gulp.task('webpack', (cb) => {
    webpack(webpackConfig).run((err, stats) => {
        if (err) throw new gutil.PluginError('client:webpack', err);
        gutil.log(stats.toString(webpackStats));
        cb();
    });
});
