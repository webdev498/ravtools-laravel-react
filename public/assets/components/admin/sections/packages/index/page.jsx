define([
	'react',
	'jsx!components/admin/sections/packages/index/page',
	'jsx!components/admin/layouts/page',
	'jsx!components/admin/app/packages_table',
	'jsx!components/admin/app/features_table',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/breadcrumb'
], function(
	React,
	Page,
	Layout,
	Packages_Table,
	Features_Table,
	Row,
	Column,
	Breadcrumb
) {
	return React.createClass({
		render: function() {
			return (
				<Layout id="packages-page" className="group-page">
					<Row>
						<Column width="12">
							<h1>Package Management</h1>
						</Column>
					</Row>
					<Packages_Table id="packages-table" />

					<Row>
						<Column width="12">
							<h1>Feature Management</h1>
						</Column>
					</Row>
					<Features_Table id="features-table" />
				</Layout>
			);
		}
	});
});