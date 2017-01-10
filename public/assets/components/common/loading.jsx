define([
	'react',
	'underscore',
	'jsx!components/common/loading',
	'jsx!components/common/row',
	'jsx!components/common/spinner'
], function(
	React,
	_,
	Loading,
	Row,
	Spinner
) {
	return React.createClass({
		render: function() {
			var className = 'now-loading' + (_.isString(this.props.className) ? ' ' + this.props.className : '');
			var elements = this.props.children ? this.props.children : (<Spinner size="50" />);

			return (
				<Row className={className}>
					{elements}
				</Row>
			);
		}
	});
});