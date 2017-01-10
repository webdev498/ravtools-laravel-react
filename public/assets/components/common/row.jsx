define([
	'react',
	'jsx!components/common/row'
], function(
	React,
	Row
) {
	return React.createClass({
		render: function() {
			var rowClass = this.props.className ? ('row ' + this.props.className) : 'row';

			return (
				<div id={this.props.id} className={rowClass}>
					{this.props.children}
				</div>
			);
		}
	});
});