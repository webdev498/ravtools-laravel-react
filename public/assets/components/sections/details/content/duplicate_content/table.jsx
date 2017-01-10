define([
	'react',
	'underscore',
	'jsx!components/sections/details/content/duplicate_content/table',
	'jsx!components/common/table',
	'jsx!components/common/link'
], function(
	React,
	_,
	Details_Table,
	Table,
	Link
) {
	return React.createClass({
		render: function() {
			var self = this;

			var endpoint = '/auditor/duplicates/content?site_id=' + self.props.site_id;

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
					data: 'canonical_url',
					title: 'Canonical URL'
				},
				{
					data: 'duplicate_content',
					title: 'Pages'
				}
			];

			var callbacks = {
				onData: function(data) {
					_.each(data, function(row) {
						if (row.duplicate_content > 0 && row.page_id1) {
							row.duplicate_content = React.renderToStaticMarkup(<Link options={ {
								label: row.duplicate_content,
								url: '#content/duplicate_content/' + self.props.site_id + '/' + row.page_id1
							} } />);
						}
					});

					return data;
				}
			};

			return (
				<Table id="details-table" endpoint={endpoint} columns={columns} callbacks={callbacks} />
			);
		}
	});
});
