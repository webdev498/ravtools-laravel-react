define([
	'react',
	'underscore',
	'jsx!components/sections/details/meta/duplicate_description/table',
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

			var endpoint = '/auditor/duplicates/descriptions?site_id=' + self.props.site_id;

			var columns = [
				{
					data: 'meta_description',
					title: 'Description'
				},
				{
					data: 'url',
					title: 'Page URL'
				},
				{
					data: 'duplicate_meta',
					title: 'Pages'
				}
			];

			var callbacks = {
				onData: function(data) {
					_.each(data, function(row) {
						if (row.duplicate_meta > 0 && row.page_id1) {
							row.duplicate_meta = React.renderToStaticMarkup(<Link options={ {
								label: row.duplicate_meta,
								url: '#meta/duplicate_description/' + self.props.site_id + '/' + row.page_id1
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
