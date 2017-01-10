define([
	'react',
	'jsx!components/sections/details/meta/duplicate_description/pages/table',
	'jsx!components/common/table'
], function(
	React,
	Details_Subtable,
	Table
) {
	return React.createClass({
		render: function() {
			var self = this;

			var endpoint = '/auditor/duplicates/descriptions/pages?site_id=' + self.props.site_id + '&page_id=' + self.props.page_id;

			var columns = [
				{
					data: 'page_title',
					title: 'Page Title'
				},
				{
					data: 'url',
					title: 'Page URL'
				}
			];

			return (
				<Table id="details-sub-table" endpoint={endpoint} columns={columns} />
			);
		}
	});
});