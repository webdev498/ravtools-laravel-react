define([
	'react',
	'jsx!components/common/text',
	'jsx!components/common/label'
], function (React, Text, Label) {
	return React.createClass({
		render : function () {
			var id = this.props.id || false;

			var required = this.props.required || false;
			var readonly = this.props.readonly || false;

			var label = null;
			if (this.props.hasOwnProperty('label') && _.isString(this.props.label)) {
				label = (<Label name={this.props.name} text={this.props.label} required={required} />);
			}

			var groupId = this.props.name + '-group';
			var inputId = this.props.name;

			return (
				<div id={groupId} className="form-group">
					{label}
					<input type="text" className="form-control" id={inputId} type={this.props.type || 'text'} name={this.props.name} placeholder={this.props.placeholder} defaultValue={this.props.value} onChange={this.props.onChange} readOnly={readonly} autoComplete="off" autoCorrect="off" spellCheck="false" autoCapitalize="off"  />
					<span className="help-block"></span>
				</div>
			);
		}
	});
});
