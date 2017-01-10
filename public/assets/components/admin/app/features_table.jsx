define([
	'react',
	'underscore',
	'jsx!components/admin/app/features_table',
	'jsx!components/common/table',
	'jsx!components/common/link',
	'jsx!components/common/date'
], function(
	React,
	_,
	Features_Table,
	Table,
	Link,
	Date
) {
	return React.createClass({
		render: function() {
			var id = this.props.id || 'features-table';

			var endpoint = this.props.endpoint || '/admin/features';

			var columns = [
				{
					data: 'name',
					title: 'Feature'
				}
			];

			if (this.props.hasOwnProperty('columns') && _.isArray(this.props.columns)) {
				columns = this.props.columns;
			}

			var callbacks = {
				onData: function(data) {
					var date_format = "MMM D, YYYY (HH:mm)";

					_.each(data, function(row) {
						row.name = React.renderToStaticMarkup(
							<Link options={ {
								label: row.name,
								url: '#packages/feature/' + row.id
							} } />
						);
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