define([
	'react',
	'jsx!components/admin/sections/packages/package/features_table',
	'jsx!components/admin/app/features_table'
], function(
	React,
	Features_Table,
	Table
) {
	return React.createClass({
		render: function() {
			var endpoint = '/admin/features/package/' + this.props.package_id;

			var columns = [
				{
					data: 'name',
					title: 'Name'
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