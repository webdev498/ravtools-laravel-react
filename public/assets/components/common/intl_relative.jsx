define([
	'react',
	'react-intl',
	'jsx!components/common/intl_relative'
], function(React, ReactIntl, IntlRelative) {
	return React.createClass({
		getInitialState: function() {
			return {
				locales: Raven.locales
			}
		},

		componentWillMount: function() {
			var self = this;

			document.addEventListener('app.locales.updated', this.handleUpdate);
		},

		componentWillUnmount: function() {
			var self = this;

			document.removeEventListener('app.locales.updated', this.handleUpdate);
		},

		handleUpdate: function() {
			var self = this;

			self.setState({locales: Raven.locales});
		},

		render: function() {
			var self = this;

			var FormattedRelative = ReactIntl.FormattedRelative;
			var locales = self.state.locales;

			return (
				<FormattedRelative
					locales={locales}
					{...self.props}
				/>
			);
		}
	});
});