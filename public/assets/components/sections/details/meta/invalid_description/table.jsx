define([
	'react',
	'jsx!components/sections/details/meta/invalid_description/table',
	'jsx!components/common/table'
], function(
	React,
	Details_Table,
	Table
) {
	return React.createClass({
		render: function() {
			var endpoint = '/auditor/pages?site_id=' + this.props.site_id + '&type=invalid_description';

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
					data: 'meta_description',
					title: 'Description'
				},
				{
					data: 'meta_description_size',
					title: 'Character Count'
				}
			];

			return (
				<Table id="details-table" endpoint={endpoint} columns={columns} />
			);
		}
	});
});
