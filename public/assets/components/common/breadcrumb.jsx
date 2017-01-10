define([
	'react',
	'jsx!components/common/breadcrumb',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/link'
], function(
	React,
	Breadcrumb,
	Row,
	Column,
	Link
) {
	return React.createClass({
		render: function() {
			var link = {
				label: this.props.label || 'Back',
				icon: 'glyphicon glyphicon-arrow-left'
			};

			if (this.props.hasOwnProperty('url') && _.isString(this.props.url)) {
				link.url = this.props.url;
			}
			else {
				link.onClick = function() {
					window.history.back();
				}
			}

			return (
				<Row className="page-breadcrumb">
					<Link options={link} />
				</Row>
			);
		}
	});
});