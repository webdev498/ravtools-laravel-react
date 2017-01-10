define([
	'react',
	'jsx!components/common/column'
], function(
	React,
	Column
) {
	return React.createClass({
		render: function() {
			var width = this.props.width || 12;
			var offset = this.props.offset || 0;

			var defaultClass = 'column col-md-' + width;

			if (offset > 0) {
				defaultClass += ' col-md-offset-' + offset;
			}

			var columnClass = this.props.className ? (defaultClass + ' ' + this.props.className) : defaultClass;

			return (
				<div id={this.props.id} className={columnClass}>
					{this.props.children}
				</div>
			);
		}
	});
});