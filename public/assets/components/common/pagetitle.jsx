define([
	'react',
	'jsx!components/common/pagetitle'
], function (
	React,
	PageTitle
) {
	return React.createClass({
		render : function () {
			var self = this;

			return (
				<div className="page-title">
					{self.props.children}
				</div>
			);
		}
	});
});
