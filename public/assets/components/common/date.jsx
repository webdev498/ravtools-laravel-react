define([
	'react',
	'underscore',
	'moment',
	'jsx!components/common/date'
], function(
	React,
	_,
	Moment,
	Date
) {
	return React.createClass({
		formatDate: function() {
			var moment = null;

			if (this.props.hasOwnProperty('ts')) {
				moment = Moment.unix(this.props.ts);
			}
			else if (this.props.hasOwnProperty('date')) {
				moment = Moment(this.props.date);
			}

			if (_.isNull(moment) || moment.isValid() == false) {
				return "Invalid Date";
			}

			var format = "MMM D, YYYY";

			if (this.props.hasOwnProperty('format')) {
				format = this.props.format;
			}

			return moment.format(format);
		},

		render: function() {
			var formatted = this.formatDate();

			return (
				<span className="date">{formatted}</span>
			);
		}
	});
});