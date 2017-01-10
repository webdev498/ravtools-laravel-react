requirejs([
	'jquery',
	'backbone',
	'react',
	'q',
	'bootstrap',
	'request',
	'event',
	'auth',
	'js/routes/admin/login',
	'js/routes/admin/accounts',
	'js/routes/admin/sites',
	'js/routes/admin/crawls',
	'js/routes/admin/packages'
], function (
	$,
	Backbone,
	React,
	Q,
	Bootstrap,
	Request,
	Event,
	Auth,
	Routes_Login,
	Routes_Accounts,
	Routes_Sites,
	Routes_Crawls,
	Routes_Packages
) {
    window.React = React; // this is not ideal; needs a RequireJS shim configuration that actually works and isn't stupid

    var App = Backbone.Router.extend({
        routes : {
            '' : 'first' /* default route */
        },

        first : function () {
			Router.navigate(Auth.getLandingPage(), {trigger: true});
        },

		execute: function(callback, args, name) {
			var token = Auth.getToken();
			var fragment = Backbone.history.fragment;

			fragment = fragment.split('/')[0];

			var publicAccess = [
				'login'
			];

			if (_.indexOf(publicAccess, fragment) > -1) {
				if (callback) callback.apply(this, args);
			}
			else {
				if (token) {
					if (callback) callback.apply(this, args);
				}
				else {
					Router.navigate('login', {trigger: true});
				}
			}
		}
    });

    Auth.setLandingPage('accounts');

    $(function () {
        Raven = {}; // intentionally global; only place things in this object that describe the current user's session

		Raven.locales = navigator.languages;

		requirejs([
			'jsx!components/admin/layouts/app'
		], function(Layout) {
			React.render(
				React.createElement(Layout),
				document.getElementById('app-container'),
				function() {
					Backbone.history.start();
				}
			);
		});

        Router = new App; // intentionally global; shouldn't contain anything other than the Backbone Router object and defined routes
        Router.routes = [];

		$.extend(Router.routes, Routes_Login);
		$.extend(Router.routes, Routes_Accounts);
		$.extend(Router.routes, Routes_Sites);
		$.extend(Router.routes, Routes_Crawls);
		$.extend(Router.routes, Routes_Packages);
	
        // closure to scope the created variables for proper cleanup
        (function (Router) {
            var section, page;

            // dynamically create all of the routes from the sections and routes defined previously
            for (section in Router.routes) {
                for (page in Router.routes[section]) {
                    if (page === 'index') { // if index is the route, make both just the section name and the route name route to it
                        Router.route(section + '(/' + page + ')', (Router.routes)[section][page]);
                    }
                    else { // just set up a simple route to the page
                        Router.route(section + '/' + page, (Router.routes)[section][page]);
                    }
                }
            }
        })(Router);
        
        Raven.api_promise = Q.defer();

        Router.on('route', function () {
        	$('.modal-backdrop').remove();
        	
        	// if not one of these routes, get the key if there isn't one
        	if (_.indexOf(['login', 'logout', 'share'], Backbone.history.getFragment()) === -1) {
        		if (Raven.api_promise.promise.inspect().state != 'fulfilled') {
					var key_options = {
						user_token: Auth.getToken(),
						user_profile: Auth.getProfile()
					};

        			Request.getKey(key_options, function(data) {
        				if (_.isObject(data) && _.isString(data.error)) {
        					if (data.code == 401) {
                                Auth.refresh().then(function () {
                                    Router.navigate(Auth.getLandingPage());
                                });

                                return false;
                            }

        					Auth.clearAuth();

        					Router.navigate('login', {trigger: true});

        					Event.fire('app.login.expired'); // technically expired or invalid

        					return false;
        				}

						Raven.api_key = data.api_key;
						Raven.api_promise.resolve(Raven.api_key);
					});
        		}
        	}
        });
    });

    Event.add('app.auth.logout', function () {
        Raven.api_promise = Q.defer();
    });

    $(function() {
        Backbone.sync = function (method, model, options) {
            var endpoint = model.endpoint,
                params = $.extend({}, options);

            if (_.isObject(model.attributes)) { // if changed attributes was passed in, we need to add those to the params in case there's a custom method
            	$.extend(params, model.attributes);
            }

            if (!_.isString(endpoint)) {
                throw '[Backbone] Collections and models require an endpoint to sync properly.';
            }

            // remove Backbone-specific stuff before sending options to server
            delete params.success;
            delete params.error;
            delete params.parse;
        };
    });
});
