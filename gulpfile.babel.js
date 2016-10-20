import gulp from 'gulp';
import runSequence from 'run-sequence';
import * as dts from 'dts-generator';


gulp.task('default', (cb) => {
    runSequence('dts', cb);
});


gulp.task('dts', () => {
    dts.default({
        name: 'redux-saga-rest',
        project: __dirname,
        out: 'index.d.ts'
    });
});
