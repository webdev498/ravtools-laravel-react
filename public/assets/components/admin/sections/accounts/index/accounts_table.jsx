define([
	'react',
	'underscore',
	'jsx!components/admin/sections/accounts/index/accounts_table',
	'jsx!components/common/table',
	'jsx!components/common/link'
], function(
	React,
	_,
	Accounts_Table,
	Table,
	Link
) {
	return React.createClass({
		render: function() {
			var endpoint = '/admin/accounts';

			var columns = [
				{
					data: 'name',
					title: 'Name'
				},
				{
					data: 'email',
					title: 'Email'
				},
				{
					data: 'status',
					title: 'Status'
				}
			];

			var callbacks = {
				onData: function(data) {
					_.each(data, function (row) {
						row.name = React.renderToStaticMarkup(<Link options={ {
							'label': row.name,
							'url': '#accounts/account/' + row.id
						} } />);

						row.status = row.status == 1 ? 'Active' : 'Inactive';
					});

					return data;
				}
			};

			return (
				<Table id="accounts-table" endpoint={endpoint} columns={columns} callbacks={callbacks} />
			);
		}
	});
});
