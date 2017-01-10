define([
	'react',
	'jquery',
	'underscore',
	'jsx!components/layouts/page',
	'jsx!components/app/top',
	'jsx!components/app/modal_help',
	'jsx!components/app/modal_upgrade',
	'jsx!components/common/modals',
	'jsx!components/common/row',
	'jsx!components/common/column'
], function(
	React,
	$,
	_,
	Layout,
	Top,
	Modal_Help,
	Modal_Upgrade,
	Modals,
	Row,
	Column
) {
	return React.createClass({

		/**
		 * Defines a grouping of column dimensions, each array must add up to 12
		 *
		 * @returns Array || bool
		 */
		getDimensions: function() {
			var type = this.props.type;

			switch (type) {
				case 'single':
					return [12];
					break;
				case 'double':
					return [6, 6];
					break;
				case 'triple':
					return [4, 4, 4];
					break;
				case 'bigLeft':
					return [8, 4];
					break;
				case 'bigRight':
					return [4, 8];
					break;
				default:
				case 'blank':
					return false;
					break;
			}
		},

		render: function() {
			var self = this;

			var id = self.props.id || 'page';
			var header = self.props.header || null;

			var columns = [];
			var dimensions = self.getDimensions();
			if (dimensions && _.isArray(self.props.children)) {
				columns = self.props.children.map(function(column, i) {
					return new React.cloneElement(column, {
						key: 'column-' + i,
						className: 'page-column',
						width: dimensions[i]
					});
				});

				columns = (<Row>{columns}</Row>);
			}
			else {
				columns = self.props.children;
			}

			/* Modals that can be triggered on every page. */
			var modals = [
				(<Modal_Help />),
				(<Modal_Upgrade />)
			];
			if (_.isArray(self.props.modals)) {
				modals = modals.concat(self.props.modals);
			}

			return (
				<div id="main" className="layout-main">
					<div id={id} className="page">
						{header}

						{columns}
					</div>
					<Modals modals={modals} />
				</div>
			);
		}
	});
});