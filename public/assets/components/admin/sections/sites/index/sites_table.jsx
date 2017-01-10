define([
	'react',
	'jsx!components/admin/sections/sites/index/sites_table',
	'jsx!components/admin/app/sites_table'
], function(
	React,
	Sites_Table,
	Table
) {
	return React.createClass({
		render: function() {
			return (
				<Table />
			);
		}
	});
});