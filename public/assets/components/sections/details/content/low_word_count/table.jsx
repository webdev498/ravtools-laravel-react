define([
	'react',
	'jsx!components/sections/details/content/low_word_count/table',
	'jsx!components/common/table'
], function(
	React,
	Details_Table,
	Table
) {
	return React.createClass({
		render: function() {
			var endpoint = '/auditor/pages?site_id=' + this.props.site_id + '&type=low_word_count';

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
					data: 'content_words',
					title: 'Word Count'
				}
			];

			return (
				<Table id="details-table" endpoint={endpoint} columns={columns} />
			);
		}
	});
});
