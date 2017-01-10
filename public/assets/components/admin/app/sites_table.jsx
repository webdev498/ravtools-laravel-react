define([
	'react',
	'underscore',
	'jsx!components/admin/app/sites_table',
	'jsx!components/common/table',
	'jsx!components/common/link',
	'jsx!components/common/date'
], function(
	React,
	_,
	Sites_Table,
	Table,
	Link,
	Date
) {
	return React.createClass({
		render: function() {
			var id = this.props.id || 'sites-table';

			var endpoint = this.props.endpoint || '/admin/sites';

			var columns = [
				{
					data: 'url',
					title: 'URL'
				},
				{
					data: 'account_id',
					title: 'Account'
				},
				{
					data: 'crawl_interval',
					title: 'Frequency'
				},
				{
					data: 'created_ts',
					title: 'Created'
				},
				{
					data: 'complete_ts',
					title: 'Recent Crawl'
				}
			];

			if (this.props.hasOwnProperty('columns') && _.isArray(this.props.columns)) {
				columns = this.props.columns;
			}

			var callbacks = {
				onData: function(data) {
					var date_format = "MMM D, YYYY (HH:mm)";

					_.each(data, function(row) {
						row.url = React.renderToStaticMarkup(
							<Link options={ {
								label: row.url,
								url: '#sites/site/' + row.id
							} } />
						);

						row.account_id = React.renderToStaticMarkup(
							<Link options={ {
								label: row.account_name,
								url: '#accounts/account/' + row.account_id
							} } />
						);

						if (row.crawl_interval == 'weekly') {
							row.crawl_interval = 'Weekly (Every ' + row.crawl_interval_setting.toUpperCase() + ')';
						}
						else if (row.crawl_interval == 'monthly') {
							row.crawl_interval = 'Monthly (On the ' + row.crawl_interval_setting + ')';
						}
						else {
							row.crawl_interval = 'Manual';
						}

						if (row.created_ts > 0) {
							row.created_ts = React.renderToStaticMarkup(
								<Date ts={row.created_ts} format={date_format} />
							);
						}

						if (row.complete_ts > 0) {
							row.complete_ts = React.renderToStaticMarkup(
								<Link options={ {
									label: (<Date ts={row.complete_ts} format={date_format} />),
									url: '#crawls/crawl/' + row.last_completed_session
								} } />
							);
						}
						else {
							row.complete_ts = '';
						}
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