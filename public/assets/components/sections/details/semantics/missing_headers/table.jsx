define([
	'react',
	'jsx!components/sections/details/semantics/missing_headers/table',
	'jsx!components/common/table'
], function(
	React,
	Details_Table,
	Table
) {
	return React.createClass({
		render: function() {
			var endpoint = '/auditor/pages?site_id=' + this.props.site_id + '&type=missing_headers';

			var columns = [
				{
					data: 'page_title',
					title: 'Page Title'
				},
				{
					data: 'url',
					title: 'Page URL'
				},
				{
					data: 'header_count_h1',
					title: 'h1'
				},
				{
					data: 'header_count_h2',
					title: 'h2'
				},
				{
					data: 'header_count_h3',
					title: 'h3'
				}
			];

			return (
				<Table id="details-table" endpoint={endpoint} columns={columns} />
			);
		}
	});
});
