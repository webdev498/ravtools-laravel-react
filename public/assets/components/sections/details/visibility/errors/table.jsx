define([
	'react',
	'jsx!components/sections/details/visibility/errors/table',
	'jsx!components/common/table'
], function(
	React,
	Details_Table,
	Table
) {
	return React.createClass({
		render: function() {
			var endpoint = '/auditor/pages?site_id=' + this.props.site_id + '&type=errors';

			var columns = [
				{
					data: 'url',
					title: 'Page URL'
				},
				{
					data: 'http_status',
					title: 'Status'
				}
			];

			return (
				<Table id="details-table" endpoint={endpoint} columns={columns} />
			);
		}
	});
});
