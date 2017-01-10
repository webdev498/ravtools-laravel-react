define([
	'react',
	'underscore',
	'react-intl',
	'jsx!components/common/intl_message'
], function(React, _, ReactIntl, IntlMessage) {
	return React.createClass({
		getInitialState: function() {
			return {
				locales: Raven.locales
			}
		},

		componentWillMount: function() {
			document.addEventListener('app.locales.updated', this.handleUpdate);
		},

		componentWillUnmount: function() {
			document.removeEventListener('app.locales.updated', this.handleUpdate);
		},

		getIntlMessage: function() {
			var self = this;

			var messages = self.props.messages;

			var target = self.props.target;
			var message = messages.default[target] || '';

			var locales = self.state.locales;

			_.each(messages, function(obj, loc) {
				if (locales.indexOf(loc) >= 0) {
					message = obj[target];
				}
			});

			return message;
		},

		handleUpdate: function() {
			var self = this;

			self.setState({locales: Raven.locales});
		},

		render: function() {
			var self = this;

			var FormattedMessage = ReactIntl.FormattedMessage;
			var message = self.getIntlMessage();

			return (
				<FormattedMessage
					message={message}
					{...self.props}
				/>
			);
		}
	});
});