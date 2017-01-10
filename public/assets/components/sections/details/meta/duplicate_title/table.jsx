define([
	'react',
	'underscore',
	'jsx!components/sections/details/meta/duplicate_title/table',
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

			var endpoint = '/auditor/duplicates/titles?site_id=' + self.props.site_id;

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
					data: 'duplicate_title',
					title: 'Pages'
				}
			];

			var callbacks = {
				onData: function(data) {
					_.each(data, function(row) {
						if (row.duplicate_title > 0 && row.page_id1) {
							row.duplicate_title = React.renderToStaticMarkup(<Link options={{
								label: row.duplicate_title,
								url: '#meta/duplicate_title/' + self.props.site_id + '/' + row.page_id1
							}} />)
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
