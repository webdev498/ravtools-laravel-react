define([
	'react',
	'jquery',
	'underscore',
	'jsx!components/admin/layouts/page',
	'jsx!components/admin/app/top',
	'jsx!components/common/modals',
	'jsx!components/common/row',
	'jsx!components/common/column'
], function(
	React,
	$,
	_,
	Layout,
	Top,
	Modals,
	Row,
	Column
) {
	return React.createClass({
		render: function() {
			var self = this;

			var id = self.props.id || 'page';

			/* Modals that can be triggered on every page. */
			var modals = [];
			
			if (_.isArray(self.props.modals)) {
				modals = modals.concat(self.props.modals);
			}

			return (
				<div id="main" className="layout-main">
					<div id={id} className="page">
						<Column width="12">
							{this.props.children}
						</Column>
					</div>
					<Modals modals={modals} />
				</div>
			);
		}
	});
});