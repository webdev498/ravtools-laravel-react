define([
	'react',
	'jsx!components/admin/sections/crawls/index/crawls_table',
	'jsx!components/admin/app/crawls_table'
], function(
	React,
	Crawls_Table,
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