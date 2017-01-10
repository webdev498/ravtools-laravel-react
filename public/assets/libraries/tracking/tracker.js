define([
	'jquery',
	'underscore',
	'backbone',
	'ravenstrategy'
], function($, _, Backbone, RavenStrategy) {
	var define_arguments = arguments;
	var tracker = {};

	var Tracker = function () {
		var self = this;

		self.debug = false;
		self.strategies = {}; // The instantiated strategy objects

		self.action = '';
		self.drilldowns = '';
		self.metric = '';
		self.metadata = {};
		self.user = {};

		/**
		* Get Custom Method
		* We needed a way to create custom methods for events that need special data
		* formatted or added.
		* The format is that track('managed', 'account.trial.morestuff', 'canceled');
		* will match a method named: managedAccountTrialMorestuffCanceled(); in the strategy
		* essential just concat everything except metadata to form the method name
		**/
		function getCustomMethod(){
		
			var method = self.action;

			_.each(self.drilldowns, function(drilldown){
				method = method + self.ucfirst(drilldown);
			});
			method = method +  self.ucfirst(self.metric);
		
			return method;
	
		}

		/**
		* Validate
		**/
		function validate(action, drilldowns, metric, metadata){
			
			if(!self.user.id){
				return false;
			}
			
			drilldowns = drilldowns || '';
			metric = metric || '';
			metadata = metadata || {};
		
			// Break up the $drilldowns. We require 3 tracking pieces: action,
			// drilldowns and metric, except for navigated which gets its metric from the url
			self.action = action;
			self.drilldowns = drilldowns.split('.');
			self.metric = metric;
			self.metadata = metadata;
		
			// every thing except navigated needs at least one drilldown
			if(_.isEmpty(self.drilldowns) && self.action != 'navigated'){
				return false;
			}
			return true;
		}

		// http://kevin.vanzonneveld.net
		// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		// +   bugfixed by: Onno Marsman
		// +   improved by: Brett Zamir (http://brett-zamir.me)
		// *     example 1: ucfirst('kevin van zonneveld');
		// *     returns 1: 'Kevin van zonneveld'
		self.ucfirst = function(str) {
			str += '';
			var f = str.charAt(0).toUpperCase();
			return f + str.substr(1);
		}
	
		// https://gist.github.com/mathewbyrne/1280286
		self.slugify = function(text) {
			return text.toString().toLowerCase()
				.replace(/\s+/g, '-')			// Replace spaces with -
				.replace(/[^\w\-]+/g, '')		// Remove all non-word chars
				.replace(/\-\-+/g, '-')			// Replace multiple - with single -
				.replace(/^-+/, '')				// Trim - from start of text
				.replace(/-+$/, '');			// Trim - from end of text
		}

		/**
		* Get Page
		**/
		self.getPage = function() {
			return Backbone.history.getFragment();
		}

		/**
		* Set user
		**/
		self.setUser = function(profile){
			self.user = {
				id: profile.user.id,
				email: profile.user.email,
				name: profile.user.name,
				created_ts: parseInt(profile.user.created_ts || 0, 10),
				updated_ts: parseInt(profile.user.updated_ts || 0, 10),
				login_ts: parseInt(profile.user.login_ts || 0, 10),
				status: profile.user.status,
				account_id: profile.account.id,
				account_name: profile.account.name,
				account_email: profile.account.email,
				account_status: profile.account.status,
				account_created_ts: parseInt(profile.account.created_ts || 0, 10),
				account_updated_ts: parseInt(profile.account.updated_ts || 0, 10),
				package_id: profile.package.id,
				package_name: profile.package.name,
				package_cost: profile.package.cost
				/* ADD BILLING STATUS HERE */
			};
		};

		/**
		* Set strategies
		* Set strategy with an object
		**/
		self.setStrategies = function(){
			self.strategies = {raven: new RavenStrategy({user: self.user})};
		};

		/**
		* Track
		**/
		self.track = function(action, drilldowns, metric, metadata){

			// Make sure we have a valid user and metrics
			if(!self.user.id || !validate(action, drilldowns, metric, metadata)){
				return false;
			}

			_.each(self.strategies,function(strategy){

				// Any number of methods: account, managed, viewed, etc may not exist for every strategy.
				// If the method doesnt exist just pass silently, dont throw an error.
				// self just means we do not want self event recorded for self strategy.
				if(_.isObject(strategy)){
	
					strategy.setAction(self.action);
					strategy.setDrilldowns(self.drilldowns);
					strategy.setMetric(self.metric);
					strategy.setMetadata(self.metadata);
					strategy.setEventName();

					// check for custom method first
					var method = getCustomMethod();
					if(_.isFunction(strategy[method])){
						strategy[method]();
					}
					else if(_.isFunction(strategy[action])){
						strategy[action]();
					}

				}
			});

		};

	};

	// "new" make a singleton
	return new Tracker;
});