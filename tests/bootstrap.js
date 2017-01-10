// Borrowed from:
// http://karma-runner.github.io/0.8/plus/RequireJS.html
var tests = [],
    file,     
    path_files = {
        'underscore': 'vendor/underscore/underscore-min',
        'backbone': 'vendor/backbone/backbone-min',
        'bootstrap': 'vendor/bootstrap/dist/js/bootstrap.min',
        'datatables': 'vendor/datatables/media/js/jquery.dataTables.min',
        'datatables-bootstrap': 'vendor/datatables-bootstrap3-plugin/media/js/datatables-bootstrap3.min',
        'jquery': 'vendor/jquery/dist/jquery.min',
        'q': 'vendor/q/q', // promises
        'react': 'vendor/react/react',
        'react-intl': 'libraries/react-intl/react-intl-with-locales.min',
        'JSXTransformer': 'vendor/jsx-requirejs-plugin/js/JSXTransformer',
        'jsx': 'libraries/react/jsx',
        'text' : 'vendor/requirejs-text/text',
        'boomerang': 'vendor/boomerang/boomerang',
        'boomerang-plugin-rt': 'vendor/boomerang/plugins/rt',
		'progressbar': 'vendor/progressbar.js/dist/progressbar.min',
        'moment': 'vendor/moment/moment',
		'auth0-lock': 'vendor/auth0-lock/build/auth0-lock.min',
        'request': 'js/request',
		'event': 'js/event',
		'auth': 'js/auth',
		'aws': 'libraries/aws/sdk',
		'tracker': 'libraries/tracking/tracker',
		'ravenstrategy': 'libraries/tracking/ravenstrategy',
		'error-generic': 'error/generic'
    };

for (file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/_Test\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    baseUrl: '/base/public/assets',

    paths: path_files,

    shim: {
        'bootstrap': {
            deps: ['jquery']
        },

        'datatables': {
            deps: ['jquery']
        },

        'datatables-bootstrap': {
            deps: ['jquery', 'bootstrap']
        },

        'react': { // also specific to testing environment only
            deps: ['../../tests/es5-shim'] // only thing that is needed by require and is in tests
        }
    },
        
    config: {
        jsx: {
            fileExtension: '.jsx'
        }
    },

    deps: tests,
    callback: window.__karma__.start
});

requirejs(['jquery', 'q'], function ($, Q) {
	/****************************************************************/
	/* Request requires the Raven object for an api_key and promise */
	/****************************************************************/
	Raven = {};
	Raven.api_promise = Q.defer();
	Raven.api_key = 'pineapple';
	Raven.api_promise.resolve(Raven.api_key);

    if ($('div#test_container', 'body').length == 0) {
        $('<div id="test_container" />').appendTo('body');
    }
});
