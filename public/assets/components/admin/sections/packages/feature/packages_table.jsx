define([
	'react',
	'jsx!components/admin/sections/packages/feature/packages_table',
	'jsx!components/admin/app/packages_table'
], function(
	React,
	Packages_Table,
	Table
) {
	return React.createClass({
		render: function() {
			var endpoint = '/admin/packages/feature/' + this.props.feature_id;

			var columns = [
				{
					data: 'name',
					title: 'Package'
				},
				{
					data: 'cost',
					title: 'Cost'
				},
				{
					data: 'quantity',
					title: 'Quantity'
				}
			];

			return (
				<Table endpoint={endpoint} columns={columns} />
			);
		}
	});
});