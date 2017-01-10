define([
	'react',
	'jsx!components/admin/sections/accounts/index/page',
	'jsx!components/admin/sections/accounts/index/accounts_table',
	'jsx!components/admin/layouts/page',
	'jsx!components/common/column',
	'jsx!components/common/row'
], function(
	React,
	Page,
	Accounts_Table,
	Layout,
	Column,
	Row
) {
	return React.createClass({
		render: function() {
			return (
				<Layout id="accounts-page" className="group-page">
					<Row>
						<Column width="12">
							<h1>Account Management</h1>
						</Column>
					</Row>
					<Accounts_Table />
				</Layout>
			);
		}
	});
});