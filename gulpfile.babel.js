import gulp from 'gulp';
import * as dts from 'dts-generator';

gulp.task('default', ['dts']);

gulp.task('dts', () => {
    dts.default({
        name: 'redux-saga-rest',
        project: __dirname,
        out: 'index.d.ts'
    });
});
