define([
	'react',
	'jsx!components/common/textarea',
	'jsx!components/common/label'
], function (React, Textarea, Label) {
	return React.createClass({
		componentWillMount : function () {
			var self = this;
		},

		componentWillUnmount : function () {
			var self = this;
		},

		render : function () {
			var required = this.props.required || false;

			return (
				<div className="form-group">
					<Label name={this.props.name} text={this.props.label} required={required} />
					<textarea className="form-control" name={this.props.name}></textarea>
				</div>
			);
		}
	});
});
