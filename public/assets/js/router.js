requirejs([
	'jquery',
	'backbone',
	'react',
	'q',
	'bootstrap',
	'request',
	'event',
	'auth',
	'tracker',
	'js/routes/login',
	'js/routes/account',
	'js/routes/sites',
	'js/routes/summary',
	'js/routes/visibility',
	'js/routes/meta',
	'js/routes/content',
	'js/routes/images',
	'js/routes/links_external',
	'js/routes/links_internal',
	'js/routes/semantics',
	'js/routes/share'
], function (
	$,
	Backbone,
	React,
	Q,
	Bootstrap,
	Request,
	Event,
	Auth,
	Tracker,
	Login,
	Account,
	Sites,
	Summary,
	Visibility,
	Meta,
	Content,
	Images,
	Links_External,
	Links_Internal,
	Semantics,
	Share
) {
    window.React = React; // this is not ideal; needs a RequireJS shim configuration that actually works and isn't stupid

    var App = Backbone.Router.extend({
        routes : {
            '' : 'first', /* default route */
			'*notFound': 'notFound' /* 404/Not Found Route */
        },

        first : function () {
			Router.navigate('sites', {trigger: true});
        },

		notFound: function() {
			Router.navigate('sites', {trigger: true});
		},

		execute: function(callback, args, name) {
			var token = Auth.getToken();
			var fragment = Backbone.history.fragment;

			fragment = fragment.split('/')[0];

			var publicAccess = [
				'login',
				'summary',
				'visibility',
				'meta',
				'content',
				'links_internal',
				'links_external',
				'images',
				'semantics',
				's'
			];

			if (_.indexOf(publicAccess, fragment) > -1) {
				if (callback) callback.apply(this, args);
			}
			else {
				return Raven.api_promise.promise.then(function() {
					if (token && _.isString(Raven.user_id)) {
						if (callback) callback.apply(this, args);
					}
					else {
						Router.navigate('login', {trigger: true});
					}
				});
			}
		}
    });

    $(function () {
        Raven = {}; // intentionally global; only place things in this object that describe the current user's session

		Raven.locales = navigator.languages;

		requirejs([
			'jsx!components/layouts/app'
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

		$.extend(Router.routes, Login);
		$.extend(Router.routes, Account);
		$.extend(Router.routes, Sites);
		$.extend(Router.routes, Summary);
		$.extend(Router.routes, Visibility);
		$.extend(Router.routes, Meta);
		$.extend(Router.routes, Content);
		$.extend(Router.routes, Links_Internal);
		$.extend(Router.routes, Links_External);
		$.extend(Router.routes, Images);
		$.extend(Router.routes, Semantics);
		$.extend(Router.routes, Share);

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

			Tracker.track('navigated');
        	// if not one of these routes, get the key if there isn't one
        	if (_.indexOf(['login', 'logout'], Backbone.history.getFragment()) === -1) {

        		if (Raven.api_promise.promise.inspect().state != 'fulfilled') {
        			 // 's' is 'share', which should use its hash
        			var hash_parts = Backbone.history.location.hash.split('/'),
        				token = Auth.getToken(),
     					temp_token,
        				key_options = {
        					user_token: token,
        					user_profile: Auth.getProfile()
        				};

        			if (hash_parts[0] === '#s') {
        				Auth.setTempToken(hash_parts[1]);
        			}

        			temp_token = Auth.getTempToken();

        			if (_.isString(temp_token)) {
        				key_options.temp_token = temp_token;
        			}

        			if (!_.isString(token) && !_.isString(temp_token)) {
        				Auth.handleLogout();

        				return false;
        			}

        			Request.getKey(key_options, function(data) {
        				if (_.isObject(data) && _.isString(data.error)) {
        					if (_.isNumber(data.code)) {
        						data.status = data.code;
        					}
    					}	
    					
    					switch (data.status) {
							case 400: // only the 400 from getKey requires a reload
							case 401: // same here but 401 instead of 400
                            case 406:
	                            Auth.handleLogout();
	                            window.location.reload(); // promise can't be reset, so we have to reload the page

								break;
    					}

    					if (_.isString(data.error)) {
        					Auth.clearAuth();

        					Router.navigate('login', {trigger: true});

        					Event.fire('app.login.expired'); // technically expired or invalid

        					return false;
    					}

						// ONLY add package data to the profile for now.
						var profile = Auth.getProfile() || [];
						_.each(['package'], function(item){
							if (data.hasOwnProperty(item)) {
								profile[item] = data[item];
							}
						});
						Auth.setProfile(profile);

						// Initiate any Analytics
						Auth.initAnalytics(data);

						Raven.api_key = data.api_key;
						Raven.account_id = (_.isObject(data.account) && data.account.id) || null;
						Raven.user_id = (_.isObject(data.user) && data.user.id) || null;
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
