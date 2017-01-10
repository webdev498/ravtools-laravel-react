define([
	'react',
	'jsx!components/sections/details/semantics/missing_schema_microdata/table',
	'jsx!components/common/table'
], function(
	React,
	Details_Table,
	Table
) {
	return React.createClass({
		render: function() {
			var endpoint = '/auditor/pages?site_id=' + this.props.site_id + '&type=missing_schema_microdata';

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
				<Table id="details-table" endpoint={endpoint} columns={columns} />
			);
		}
	});
});
