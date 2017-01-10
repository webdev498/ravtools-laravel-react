define([
	'react',
	'underscore',
	'jsx!components/admin/app/packages_table',
	'jsx!components/common/table',
	'jsx!components/common/link',
	'jsx!components/common/date'
], function(
	React,
	_,
	Packages_Table,
	Table,
	Link,
	Date
) {
	return React.createClass({
		render: function() {
			var id = this.props.id || 'packages-table';

			var endpoint = this.props.endpoint || '/admin/packages';

			var columns = [
				{
					data: 'name',
					title: 'Package'
				},
				{
					data: 'cost',
					title: 'Cost'
				}
			];

			if (this.props.hasOwnProperty('columns') && _.isArray(this.props.columns)) {
				columns = this.props.columns;
			}

			var callbacks = {
				onData: function(data) {
					var date_format = "MMM D, YYYY (HH:mm)";

					_.each(data, function(row) {
						row.name = React.renderToStaticMarkup(
							<Link options={ {
								label: row.name,
								url: '#packages/package/' + row.id
							} } />
						);

						row.cost = '$ ' + row.cost;
					});

					return data;
				}
			};

			if (this.props.hasOwnProperty('callbacks') && _.isObject(this.props.callbacks)) {
				callbacks = this.props.callbacks;
			}

			return (
				<Table id={id} endpoint={endpoint} columns={columns} callbacks={callbacks} disableAuto={true} />
			);
		}
	});
});