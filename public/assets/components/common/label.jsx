define([
	'react',
	'jsx!components/common/label'
], function (React, Textarea) {
	return React.createClass({
		componentWillMount : function () {
			var self = this;
		},

		componentWillUnmount : function () {
			var self = this;
		},

		render : function () {
			var has_required = this.props.required || false,
				required = '';

			if (has_required === true) {
				required = (
					<span className="label label-danger">Required</span>
				);
			}

			return (
				<label htmlFor={this.props.name}>
					{this.props.text} {required}
				</label>
			);
		}
	});
});
