requirejs.config({
    baseUrl: '/assets',

    paths: {
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
		'clipboard': 'vendor/clipboard/dist/clipboard.min',
		'validate': 'vendor/validate.js/validate.min',
		'error-generic': 'error/generic',
		'request': 'js/request',
		'event': 'js/event',
		'auth': 'js/auth',
		'issues': 'js/issues',
		'aws': 'libraries/aws/sdk',
		'tracker': 'libraries/tracking/tracker',
		'ravenstrategy': 'libraries/tracking/ravenstrategy'
    },

    shim: {
        'bootstrap': {
            deps: ['jquery']
        },

        'datatables': {
            deps: ['jquery']
        },

        'datatables-bootstrap': {
            deps: ['bootstrap', 'datatables']
        },

        'boomerang-plugin-rt': {
			deps: ['boomerang']
		},

		'progressbar': {
			exports: 'ProgressBar'
		},

		'react-intl': {
			deps: ['react'],
			exports: 'ReactIntl'
		},

		'auth0-lock': {
			exports: 'Auth0Lock'
		},

		'clipboard': {
			exports: 'Clipboard'
		},

		'validate': {
			exports: 'validate'
		}
    },
        
    config: {
        jsx: {
            fileExtension: '.jsx'
        }
    }
});
