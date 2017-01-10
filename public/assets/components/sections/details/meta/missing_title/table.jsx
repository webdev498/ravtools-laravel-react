define([
	'react',
	'jsx!components/sections/details/meta/missing_description/table',
	'jsx!components/common/table'
], function(
	React,
	Details_Table,
	Table
) {
	return React.createClass({
		render: function() {
			var endpoint = '/auditor/pages?site_id=' + this.props.site_id + '&type=missing_title';

			var columns = [
				{
					data: 'url',
					title: 'Page URL'
				}
			];

			return (
				<Table id="details-table" endpoint={endpoint} columns={columns} />
			);
		}
	});
});
