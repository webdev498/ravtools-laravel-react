define([
	'react',
	'underscore',
	'jsx!components/common/icon'
], function(
	React,
	_,
	Icon
) {
	return React.createClass({
		render: function() {
			var base = 'icon';
			var library = 'glyphicon';
			var icon = this.props.icon || 'glyphicon-question-sign';

			var complex = icon.split(' ').length - 1;

			if (complex.length > 1) {
				icon = this.props.icon;
			}
			else {
				icon = library + ' ' + this.props.icon;
			}

			var iconClass = base + ' ' + icon;

			return (
				<span className={iconClass}></span>
			);
		}
	});
});