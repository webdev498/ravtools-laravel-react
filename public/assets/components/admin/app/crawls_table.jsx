define([
	'react',
	'underscore',
	'jsx!components/admin/app/crawls_table',
	'jsx!components/common/table',
	'jsx!components/common/link',
	'jsx!components/common/date'
], function(
	React,
	_,
	Crawls_Table,
	Table,
	Link,
	Date
) {
	return React.createClass({
		render: function() {
			var id = this.props.id || 'crawls-table';

			var endpoint = this.props.endpoint || '/admin/crawls';

			var columns = [
				{
					data: 'complete_ts',
					title: 'Crawl'
				},
				{
					data: 'site_url',
					title: 'Site'
				},
				{
					data: 'score',
					title: 'Score'
				},
				{
					data: 'pages_crawled',
					title: 'Pages'
				},
				{
					data: 'total_issues',
					title: 'Issues'
				}
			];

			if (this.props.hasOwnProperty('columns') && _.isArray(this.props.columns)) {
				columns = this.props.columns;
			}

			var callbacks = {
				onData: function(data) {
					var date_format = "MMM D, YYYY (HH:mm)";

					_.each(data, function(row) {
						row.complete_ts = React.renderToStaticMarkup(
							<Link options={ {
								label: (<Date ts={row.complete_ts} format={date_format} />),
								url: '#crawls/crawl/' + row.id
							} } />
						);

						row.site_url = React.renderToStaticMarkup(
							<Link options={ {
								label: row.site_url,
								url: '#sites/site/' + row.site_id
							} } />
						);

						row.pages_crawled = row.pages_crawled || 0;
						row.total_issues = row.total_issues || 0;
					});

					return data;
				}
			};

			if (this.props.hasOwnProperty('callbacks') && _.isObject(this.props.callbacks)) {
				callbacks = this.props.callbacks;
			}

			return (
				<Table id={id} endpoint={endpoint} columns={columns} callbacks={callbacks} disableAuto={true} />
			);
		}
	});
});