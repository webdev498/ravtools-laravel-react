define([
	'react',
	'jsx!components/sections/details/visibility/blocked_by_robots/table',
	'jsx!components/common/table'
], function(
	React,
	Details_Table,
	Table
) {
	return React.createClass({
		render: function() {
			var endpoint = '/auditor/pages?site_id=' + this.props.site_id + '&type=blocked_by_robots';

			var columns = [
				{
					data: 'url',
					title: 'Page URL'
				},
				{
					data: 'blocked_by_robots',
					title: 'By robots.txt'
				},
				{
					data: 'blocked_by_noindex',
					title: 'By noindex'
				}
			];

			return (
				<Table id="details-table" endpoint={endpoint} columns={columns} />
			);
		}
	});
});
