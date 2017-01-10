define([
	'react',
	'jsx!components/admin/layouts/page',
	'jsx!components/admin/sections/sites/index/page',
	'jsx!components/admin/sections/sites/index/sites_table',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/breadcrumb'
], function(
	React,
	Layout,
	Page,
	Sites_Table,
	Row,
	Column,
	Breadcrumb
) {
	return React.createClass({
		render: function() {
			return (
				<Layout id="sites-page" className="group-page">
					<Row>
						<Column width="12">
							<h1>Site Management</h1>
						</Column>
					</Row>
					<Sites_Table />
				</Layout>
			);
		}
	});
});