define([
	'react',
	'jquery',
	'underscore',
	'event',
	'jsx!components/common/alert',
	'jsx!components/common/alerts'
], function(
	React,
	$,
	_,
	Event,
	Alert,
	Alerts
) {
	return React.createClass({
		getInitialState: function() {
			return {
				alert: null
			}
		},

		componentWillMount: function() {
			var self = this;

			Event.add('app.alert.show', function(event) {
				var options = event.detail;
				self.showAlert(options);
			});

			Event.add('app.alert.hide', function() {
				self.hideAlert();
			});

			Event.add('request.api.success', this.handleSuccess);
			Event.add('request.api.error', this.handleError);
		},

		componentWillUnmount: function() {
			var self = this;

			Event.remove('app.alert.show', function(event) {
				var options = event.detail;
				self.showAlert(options);
			});

			Event.remove('app.alert.hide', function() {
				self.hideAlert();
			});

			Event.remove('request.api.success', this.handleSuccess);
			Event.remove('request.api.error', this.handleError);
		},

		handleSuccess: function(event) {
			if(event.detail.hasOwnProperty('silent') && event.detail.silent === true) {
				return;
			}

			this.showAlert({
				tag: 'request',
				type: 'success',
				message: (
					<p>
						<strong>Success</strong>
						{event.detail.status}
					</p>
				)
			});
		},

		handleError: function(event) {
			if (event.detail.hasOwnProperty('silent') && event.detail.silent === true) {
				return;
			}

			this.showAlert({
				tag: 'request',
				type: 'danger',
				message: (
					<p>
						<strong>Error</strong>
						{event.detail.error}<br /><em>{event.detail.status}</em>
					</p>
				)
			});
		},

		showAlert: function(options) {
			var self = this;
			var alerts = React.findDOMNode(self);

			$(alerts).fadeOut(250, function() {
				self.setState({
					alert: options
				});

				$(alerts).fadeIn(250);
			});
		},

		hideAlert: function() {
			var self = this;
			var alerts = React.findDOMNode(self);

			$(alerts).fadeOut(250, function() {
				self.setState({
					alert: null
				});
			});
		},

		buildAlert: function() {
			var options = this.state.alert;

			if (!options.hasOwnProperty('tag')) {
				console.warn('Every Alert should have a reference `tag`.');
			}

			var key = _.uniqueId('alert-');
			var tag = options.tag || 'alert.generic';

			var alert = (
				<Alert id={key} key={key} tag={tag} type={options.type} persist={options.persist} spinner={options.spinner}>
					{options.message}
				</Alert>
			);

			return alert;
		},

		render: function() {
			var alert = null;

			if (_.isObject(this.state.alert)) {
				alert = this.buildAlert();
			}

			return (
				<div id="alerts">
					{alert}
				</div>
			);
		}
	});
});