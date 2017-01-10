define([
	'react',
	'jsx!components/sections/details/visibility/redirects/table',
	'jsx!components/common/table'
], function(
	React,
	Details_Table,
	Table
) {
	return React.createClass({
		render: function() {
			var endpoint = '/auditor/pages/?site_id=' + this.props.site_id + '&type=redirects';

			var columns = [
				{
					data: 'url',
					title: 'Page URL'
				},
				{
					data: 'redirect_url',
					title: 'Redirect URL'
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
