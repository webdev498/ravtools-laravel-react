define([
	'jquery',
	'underscore',
	'event',
	'auth'
], function($, _, Event, Auth) {
	var Request = {};

	Request.api_prefix = '/api/v1';
	Request.exponential_backoff = 500;
	Request.exponential_backoff_timeout = null;

	Request.getApiPrefix = function () {		
		var protocol = window.location.protocol || 'http:',
			hostname = window.location.hostname || 'INVALID_HOSTNAME',
			port = (protocol === 'http:' ? ':8088' : ''),
			prefix = protocol + '//' + hostname + port + this.api_prefix;

		return prefix;
	};

	Request.getKey = function(options, callback) {
		var user_token = options.user_token, 
			user_profile = options.user_profile,
			endpoint = this.getApiPrefix() + '/key',
			post_params = {
				token: user_token, 
				profile: JSON.stringify(user_profile),
				url: window.location.hash
			};

		if (options.hasOwnProperty('temp_token')) {
			post_params.temp_token = options.temp_token;
		}

		// intentionally not using Request.post because Request requires a key promise to be fulfilled, which this will do
		$.ajax({
			url: endpoint,
			method: 'post',
			data: post_params,
			dataType: 'json',
			success: function (data) {
				callback(data);
			},
			error: function (data) {
				callback(data);
			}
		});
	};

	Request.getEndpoint = function(endpoint) {
		var self = this;

		return Raven.api_promise.promise.then(function() {
			return {
				url: self.api_prefix + endpoint,
				api_key: Raven.api_key
			};
		});
	};

	Request.getApiUrl = function(endpoint, prependHost) {
		if (_.isUndefined(prependHost)) {
			prependHost = false;
		}

		var url = this.api_prefix + endpoint;

		if (prependHost == true) {
			url = window.location.origin + url;
		}

		return this.appendApiKey(url);
	};

	Request.api = function(method, endpoint, options) {
		if (!options.hasOwnProperty('data') || !_.isObject(options.data)) {
			options.data = {};
		}

		if (!options.hasOwnProperty('dataType') || !_.isString(options.dataType)) {
			options.dataType = 'json';
		}

		if (!options.hasOwnProperty('silent')) {
			options.silent = false;
		}

		var url = this.getApiPrefix() + endpoint;

		if (!options.hasOwnProperty('onSuccess') || !_.isFunction(options.onSuccess)) {
			options.onSuccess = function(data, status, xhr) {
				Event.fire('request.api.success', {
					data: options.data,
					status: status,
					silent: options.silent,
					xhr: xhr
				});
			}
		}

		if (!options.hasOwnProperty('onError') || !_.isFunction(options.onError)) {
			options.onError = function(xhr, error) {
				var reason = 'An error was encountered while performing your request.';
				var code = 400;

				if (xhr.hasOwnProperty('responseJSON') && _.isObject(xhr.responseJSON)) {
					reason = xhr.responseJSON.reason;
					code = xhr.responseJSON.code;
				}

				Event.fire('request.api.error', {
					error: reason,
					status: code,
					silent: options.silent,
					xhr: xhr
				});
			}
		}

		return Raven.api_promise.promise.then(function() {
			var global_data = {
				api_key: Raven.api_key
			};

			var data = $.extend(true, {}, global_data, options.data);

			var requestClosure = function() {
				var on_error = function (jqXHR, textStatus) {
					switch (jqXHR.status) {
						case 401: // in case of a 401 Unauthorized, the token became invalidated by a new one; refresh it using the old token
							Auth.refresh().then(function () {
								clearTimeout(Request.exponential_backoff_timeout);

								if (Request.exponential_backoff >= 4000) { // we've tried as hard as we can, but they're just not authorized
									Request.exponential_backoff = 500;

									Event.fire('request.api.error', {
										error: 'Session expired. Please logout and log back in.',
										status: 401
									});

									return false;
								}

								Request.exponential_backoff *= 2;

								Request.exponential_backoff_timeout = setTimeout(function () {
									make_request();
								}, Request.exponential_backoff);
							});

							break;

						case 406: // in case of a 406 Not Acceptable, the current auth is missing required verified information. log out the user
							Auth.handleLogout();
							window.location.reload(); // promise can't be reset, so we have to reload the page
							
							break;

						case 410: // in case of a 410 Gone, the site requested has been removed. redirect to landing page
							window.location = Auth.getLandingPage();
							
							break;

						default:
							if (_.isFunction(options.onError)) {
								options.onError(jqXHR, textStatus);
							}

							break;
					}
				};

				var make_request = function () {
					$.ajax({
						url: url,
						method: method,
						data: data,
						dataType: options.dataType,
						success: options.onSuccess,
						error: on_error
					});
				};

				make_request();
			};

			requestClosure();
		});
	};

	Request.get = function(endpoint, options) {
		return Request.api('GET', endpoint, options);
	};

	Request.post = function(endpoint, options) {
		return Request.api('POST', endpoint, options);
	};

	Request.put = function(endpoint, options) {
		return Request.api('PUT', endpoint, options);
	};

	Request.delete = function(endpoint, options) {
		return Request.api('DELETE', endpoint, options);
	};

	Request.appendApiKey = function (url) {
		// if the url already has a query string param, add a &; else, add a ?
		if ((/\?\w+/).test(url)) {
			url += '&';
		}
		else {
			url += '?';
		}

		url += 'api_key=' + Raven.api_key;

		return url;
	};

	return Request;
});
