define([
	'react',
	'jsx!components/admin/sections/sites/site/crawls_table',
	'jsx!components/admin/app/crawls_table'
], function(
	React,
	Crawls_Table,
	Table
) {
	return React.createClass({
		render: function() {
			var endpoint = '/admin/crawls/site/' + this.props.site_id;

			var columns = [
				{
					data: 'complete_ts',
					title: 'Crawl'
				},
				{
					data: 'score',
					title: 'Score'
				},
				{
					data: 'pages_crawled',
					title: 'Pages'
				},
				{
					data: 'total_issues',
					title: 'Issues'
				}
			];

			return (
				<Table endpoint={endpoint} columns={columns} />
			);
		}
	});
});