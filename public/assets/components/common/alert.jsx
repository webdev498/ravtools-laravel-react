define([
	'react',
	'underscore',
	'event',
	'jsx!components/common/alert',
	'jsx!components/common/button',
	'jsx!components/common/icon'
], function(
	React,
	_,
	Event,
	Alert,
	Button,
	Icon
) {
	return React.createClass({
		componentDidMount: function() {
			var self = this;

			if (self.props.persist == true || self.props.spinner == true) {
				return;
			}

			self.timeout = setTimeout(function() {
				self.handleHide();
			}, 3000);
		},

		handleHide: function() {
			clearTimeout(this.timeout);

			Event.fire('app.alert.hide');
		},

		render: function() {
			var self = this;
			var enable_timers = true;

			var alertType = 'alert-info';
			if (_.isString(self.props.type)) {
				alertType = 'alert-' + self.props.type;
			}

			var control = null;
			if (self.props.spinner == true) {
				control = (
					<span className="spinner"><Icon icon="glyphicon-refresh" /></span>
				);
			}
			else {
				var button = {
					label: (<span>&times;</span>),
					buttonClass: 'close',

					onClick: function() {
						self.handleHide();
					}
				};

				control = (
					<Button options={button} />
				);
			}

			var timer = null;
			if (self.props.persist != true && enable_timers) {
				timer = (
					<div className="alert-timer"></div>
				);
			}

			return (
				<div id={self.props.id} className={'alert fade in ' + alertType} rel={self.props.tag} role="alert">
					<div className="alert-control">
						{control}
					</div>
					{timer}
					{self.props.children}
				</div>
			);
		}
	});
});