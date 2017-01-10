define([
	'react',
	'underscore',
	'jsx!components/sections/details/links_external/broken/table',
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

			var endpoint = '/auditor/links?site_id=' + this.props.site_id + '&type=external_broken';

			var columns = [
				{
					data: 'url',
					title: 'URL'
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
								url: '#links_external/broken/' + self.props.site_id + '/' + row.url_hash
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