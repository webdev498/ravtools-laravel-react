define([
	'react',
	'underscore',
	'jsx!components/sections/details/images/missing_title/table',
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
		render: function () {
			var self = this;

			var endpoint = '/auditor/images?site_id=' + self.props.site_id + '&type=missing_title';

			var columns = [
				{
					data: 'url',
					title: 'Image Filename'
				},
				{
					data: 'pages',
					title: 'Pages'
				}
			];

			var callbacks = {
				onData: function (data) {
					_.each(data, function(row) {
						if (row.pages > 0 && row.url_hash) {
							row.pages = React.renderToStaticMarkup(<Link options={ {
								label: row.pages,
								url: '#images/missing_title/' + self.props.site_id + '/' + row.url_hash
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