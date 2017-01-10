// Karma configuration
// Generated on Mon Feb 15 2016 22:47:08 GMT+0000 (UTC)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine', 'requirejs'],


        // list of files / patterns to load in the browser
        files: [
			{pattern: "public/assets/error/*.js", included: false},
			{pattern: "public/assets/js/*.js", included: false},
            {pattern: "tests/es5-shim.js", included: false},
            "public/assets/vendor/requirejs-bower/require.js",
            {pattern: 'public/assets/libraries/**/*.js', included: false}, // mainly for jsx
            {pattern: 'public/assets/vendor/**/*.js', included: false},
            {pattern: 'public/assets/vendor/**/**/*.js', included: false},
            'tests/bootstrap.js',
            {pattern: 'public/assets/components/**/tests/*_Test.js', included: false}, // first level of nesting (global / common)
            {pattern: 'public/assets/components/**/**/tests/*_Test.js', included: false}, // second level of nesting (section -> subsection)
            {pattern: 'public/assets/components/**/*.jsx', included: false},
            {pattern: 'public/assets/components/**/**/*.jsx', included: false}
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DISABLE,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
}
