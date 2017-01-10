define([
	'react',
	'react-intl',
	'jsx!components/common/intl_date'
], function(React, ReactIntl, IntlDate) {
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

			var FormattedDate = ReactIntl.FormattedDate;
			var locales = self.state.locales;

			return (
				<FormattedDate
					locales={locales}
					{...self.props}
				/>
			);
		}
	});
});