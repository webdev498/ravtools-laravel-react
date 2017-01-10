define([
	'react',
	'jsx!components/admin/sections/accounts/account/sites_table',
	'jsx!components/admin/app/sites_table'
], function(
	React,
	Sites_Table,
	Table
) {
	return React.createClass({
		render: function() {
			var endpoint = '/admin/sites/account/' + this.props.account_id;

			var columns = [
				{
					data: 'url',
					title: 'URL'
				},
				{
					data: 'crawl_interval',
					title: 'Frequency'
				},
				{
					data: 'created_ts',
					title: 'Created'
				},
				{
					data: 'complete_ts',
					title: 'Last Completed Crawl'
				}
			];

			return (
				<Table endpoint={endpoint} columns={columns} />
			);
		}
	});
});