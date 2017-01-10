define([
	'react',
	'underscore',
	'jsx!components/sections/account/index/table',
	'jsx!components/common/table'
], function(
	React,
	_,
	Table_History,
	Table
) {
	return React.createClass({
		render: function() {
			var endpoint = '/billing/invoices';

			var columns = [
				{
					data: 'date',
					title: 'Date'
				},
				{
					data: 'type',
					title: 'Type'
				},
				{
					data: 'amount',
					title: 'Amount'
				}
			];

			return (
				<Table id="account-table" endpoint={endpoint} columns={columns} search={false} />
			);
		}
	});
});