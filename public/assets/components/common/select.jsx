define([
	'react',
	'jsx!components/common/select',
	'jsx!components/common/label'
], function(React, Select, Label) {
	return React.createClass({
		render: function() {
			var self = this;

			var required = self.props.required || false;

			var options = [];
			if (_.isArray(self.props.options)) {
				options = self.props.options.map(function(option, i) {
					var key = self.props.name + '-option-' + i;
					return (
						<option key={key} value={option.value}>{option.label}</option>
					);
				});
			}

			var onChange = null;
			if (_.isFunction(self.props.onChange)) {
				onChange = self.props.onChange;
			}

			var defaultValue = null;
			if (self.props.hasOwnProperty('defaultValue') && !_.isEmpty(self.props.defaultValue)) {
				defaultValue = self.props.defaultValue;
			}

			var value = null;
			if (self.props.hasOwnProperty('value') && !_.isEmpty(self.props.value)) {
				value = self.props.value;
			}

			return (
				<div className="form-group">
					<Label name={self.props.name} text={self.props.label} required={required} />
					<select className="form-control" name={self.props.name} placeholder={self.props.placeholder || 'Select One'} onChange={onChange} defaultValue={defaultValue} value={value}>
						{options}
					</select>
				</div>
			);
		}
	});
});