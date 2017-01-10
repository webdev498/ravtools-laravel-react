define([
	'jquery',
	'underscore',
	'backbone',
	'aws'
], function($, _, Backbone, AWS) {
	/**
	 * RavenStrategy
	 * User event logging
	**/
	var RavenStrategy = function(options) {
		var self = this;
	
		self.action = '';
		self.drilldowns = [];
		self.metric = '';
		self.metadata = {};
		self.options = {
			version : 1, // this version needs to match the PHP version
			event : {},
			user : {},
			agent : {} 
		};
		self.sns = {};

		// AWS Tracking config.
		self.aws_config = {
			tracking: {
				key: 'AKIAIX6H3A5YOVST7D4A',
				secret: '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',
				topic: function(){
					if (window.location.hostname === 'auditor.raventools.com') { // TODO change to config option
						return 'arn:aws:sns:us-east-1:854885116761:AuditorUserTracking-Production'
					}
					return 'arn:aws:sns:us-east-1:854885116761:AuditorUserTracking-Test'
				}()
			}
		}

		function __construct() {
			self.setUser(options.user);
			// validate that AWS and requirements are available
			if (typeof AWS === 'undefined' || !_.isObject(AWS)) {
				return false;
			}
			else if (_.isEmpty(AWS.SNS)) {
				return false;
			}
			else if (_.isEmpty(AWS.Credentials)) {
				return false;
			}
			AWS.config.credentials = new AWS.Credentials(self.aws_config.tracking.key, self.aws_config.tracking.secret);
			AWS.config.region = 'us-east-1';
		
			self.sns = new AWS.SNS({params: {TopicArn: self.aws_config.tracking.topic}});
	 	}
	
		/**
		* Set Agent
		**/
		function setAgent(){
			self.options.agent.string = navigator.userAgent;
			self.options.agent.language = navigator.language;
		}
	
		/**
		* Set User
		**/
		self.setUser = function(user){
			self.options.user = user;
		};
	
		/**
		* Set Action
		**/
		self.setAction = function(action){
			self.action = action;
		};

		/**
		* Set Section
		**/
		self.setDrilldowns = function(drilldowns){
			self.drilldowns = drilldowns || [];
		};
	
		/**
		* Set Metric
		**/
		self.setMetric = function(metric){
			self.metric = metric;
		};
	
		/**
		* Set Metadata
		**/
		self.setMetadata = function(metadata){
			self.options.event.metadata = metadata || {};
		};
	
		/**
		* Set Event Name
		**/
		self.setEventName = function(){
			self.options.event.name = {action : self.action, drilldowns : self.drilldowns, metric : self.metric};
		};
	
		/**
		* Navigated To
		**/
		self.navigated = function(){
			self.options.event.name.metric = Backbone.history.getFragment();
			self.options.event.name.drilldowns = [];
			self.sendEvent();
		};
	
		/**
		* Managed
		**/
		self.managed = function(){
			self.sendEvent();
		};
	
		/**
		* Viewed 
		**/
		self.viewed = function(){
			self.sendEvent();
		};

		/**
		 * Clicked
		 */
		self.clicked = function() {
			self.sendEvent();
		};
		
		/**
		* Events
		* Posts data to the specified url endpoint
		*/
		self.sendEvent = function() {
			if (!_.isFunction(self.sns.publish)) {
				return false; // bail, we can't publish without a publish
			}

			// Event agent details
			setAgent();

			self.options.event.insert_ts = Date.now() / 1000 | 0; // timestamp in seconds

			try {
				self.sns.publish({Message: JSON.stringify(self.options)}, function(error, response){});
			} catch (err) {
				console.log('Unhandled Error: ' + err);
			}

		};
	
		__construct();
	
	};

	return RavenStrategy;
});