define([
	'react',
	'jsx!components/common/message'
], function(
	React,
	Message
) {
	return React.createClass({
		render: function() {
			var type = this.props.type;

			return (
				<div id={this.props.id} className={'message' + ' ' + type} role="message">
					{this.props.children}
				</div>
			);
		}
	});
});