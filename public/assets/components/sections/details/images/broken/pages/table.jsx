define([
	'react',
	'jsx!components/sections/details/images/broken/pages/table',
	'jsx!components/common/table'
], function(
	React,
	Details_Subtable,
	Table
) {
	return React.createClass({
		render: function() {
			var self = this;

			var endpoint = '/auditor/images/pages?site_id=' + self.props.site_id + '&url_hash=' + self.props.url_hash + '&type=broken';

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