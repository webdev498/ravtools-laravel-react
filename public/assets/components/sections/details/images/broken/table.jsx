define([
	'react',
	'underscore',
	'jsx!components/sections/details/images/broken/table',
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

			var endpoint = '/auditor/images?site_id=' + self.props.site_id + '&type=broken';

			var columns = [
				{
					data: 'url',
					title: 'Image Filename'
				},
				{
					data: 'http_status',
					title: 'Status'
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
							row.pages = React.renderToStaticMarkup(<Link options={{
								label: row.pages,
								url: '#images/broken/' + self.props.site_id + '/' + row.url_hash
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