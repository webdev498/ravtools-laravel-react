define([
	'jquery',
	'underscore',
	'event',
	'auth0-lock',
	'q',
	'tracker'
], function(
	$,
	_,
	Event,
	Auth0Lock,
	Q,
	Tracker
) {
	var Auth = {};

	Auth.landing_page = 'sites';

	Auth.setLandingPage = function (page) {
		Auth.landing_page = page;
	};

	Auth.getLandingPage = function () {
		return Auth.landing_page;
	};

	Auth.buildLock = function() {
		return new Auth0Lock('9kWf2McjX59zFjzRGKL29I4zVGnMhatS', 'raven-auditor.auth0.com');
	};

	Auth.checkLogin = function() {
		var lock = Auth.buildLock();
		var authHash = lock.parseHash(window.location.name);

		if (_.isObject(authHash) && authHash.hasOwnProperty('id_token')) {
			Auth.setToken(authHash.id_token);

			this.updateProfile(function() {
				Event.fire('app.auth.login');

				Router.navigate(Auth.getLandingPage(), {trigger: true});
			});
		}
	};

	Auth.handleLogin = function(callback, params) {
		var self = this,
			lock = this.buildLock();

		var standard = {
			authParams: {
				scope: 'openid offline_access name email',
				access_type: 'offline'
			},
			connections: ['google-oauth2'],
			responseType: 'token',
			icon: '/assets/img/raven-white.svg'
		};

		if (_.isUndefined(params)) {
			params = {};
		}

		var options = _.extend({}, standard, params);

		lock.show(options, function (err, profile, id_token, access_token, state, refresh_token) {
			if (!err && id_token) {
				Auth.setToken(id_token);
				Auth.setProfile(profile);
				localStorage.setItem('refreshToken', refresh_token);

				Event.fire('app.auth.login');

				if(_.isFunction(callback)) {
					callback();
				}
				else {
					Router.navigate(Auth.getLandingPage(), {trigger: true});
				}
			}
		});
	};

	Auth.isLoggedIn = function() {
		return _.isObject(Raven) && _.isString(Raven.user_id);
	};

	Auth.handleLogout = function(callback) {
		this.clearAuth();

		Event.fire('app.auth.logout');

		if (_.isFunction(callback)) {
			callback();
		}
		else {
			Router.navigate('login', {trigger: true});
		}
	};

	Auth.updateProfile = function(callback) {
		var lock = Auth.buildLock();
		var token = Auth.getToken();

		lock.getProfile(token, function(err, profile) {
			if (err) {
				console.error('Error during Auth.getProfile:', err);
				return;
			}

			if (_.isObject(profile)) {
				Auth.setProfile(profile);

				Event.fire('app.auth.updated');

				if (_.isFunction(callback)) {
					callback(profile);
				}	
			}
		});
	};

	Auth.clearAuth = function () {
		localStorage.clear();
	};

	Auth.refresh = function () {
		var lock = Auth.buildLock(),
			refresh_promise = Q.defer(),
			refresh_token = this.getRefreshToken();

		if (!_.isString(refresh_token)) {
			refresh_token = this.getToken();
		}
		
		lock.getClient().refreshToken(refresh_token, function (err, delegationResult) {
			if (!err && _.isObject(delegationResult) && _.isString(delegationResult.id_token)) {
				Auth.setToken(delegationResult.id_token);

				refresh_promise.resolve(delegationResult.id_token);
			}
		});
	
		return refresh_promise.promise;
	};

	Auth.setToken = function (token) {
		localStorage.setItem('userToken', token);
	};

	Auth.getTempToken = function () {
		return localStorage.getItem('userTempToken');
	};

	Auth.setTempToken = function (token) {
		localStorage.setItem('userTempToken', token);
	};

	Auth.clearTempToken = function () {
		localStorage.removeItem('userTempToken');
	};

	Auth.getToken = function() {
		return localStorage.getItem('userToken');
	};

	Auth.getRefreshToken = function() {
		return localStorage.getItem('refreshToken');
	};

	Auth.setProfile = function (profile) {
		var keys_for_removal = ['clientID', 'global_client_id', 'identities', 'user_id', 'email_verified'];

		// comes in with tracking; keeps users permanently logged in during share
		keys_for_removal = keys_for_removal.concat(['user', 'account']);

		// Make profile an object first if not so.
		if(_.isString(profile)){
			profile = JSON.parse(profile);
		}
		_.each(keys_for_removal, function (key) {
			if (profile.hasOwnProperty(key)) {
				delete profile[key];
			}
		});

		localStorage.setItem('userProfile', JSON.stringify(profile));
	};

	Auth.getProfile = function() {
		return JSON.parse(localStorage.getItem('userProfile'));
	};

	Auth.getServicePlan = function() {
		var profile = this.getProfile();
		if (profile.hasOwnProperty('package') && _.isObject(profile.package)) {
			return profile.package;
		}
		else {
			return null;
		}
	};

	Auth.setServicePlan = function(plan) {
		var profile = this.getProfile();
		profile.package = plan;
		this.setProfile(profile);
	};

	Auth.initAnalytics = function(data) {
		if (_.isObject(data) && data.hasOwnProperty('user')) {
			// Track the first navigation now
			Tracker.setUser(data);
			Tracker.setStrategies();
			Tracker.track('navigated');	

			if (typeof FS !== 'undefined' && _.isObject(FS) && _.isFunction(FS.identify)) {
				/* FullStory Identify User and Custom Data */
				FS.identify(data.user.id, {
					displayName: data.user.name,
					email: data.user.email,
					product: 'auditor',
					userID: data.user.id,
					accountID: data.account.id
				});	
			}
		}
	};

	Event.add('auth.refresh', function () {
		Auth.refresh();
	});

	return Auth;
});
