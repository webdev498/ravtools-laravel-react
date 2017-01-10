define([
	'react',
	'jsx!components/admin/layouts/page',
	'jsx!components/admin/sections/crawls/index/page',
	'jsx!components/admin/sections/crawls/index/crawls_table',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/breadcrumb'
], function(
	React,
	Layout,
	Page,
	Crawls_Table,
	Row,
	Column,
	Breadcrumb
) {
	return React.createClass({
		render: function() {
			return (
				<Layout id="crawls-page" className="group-page">
					<Row>
						<Column width="12">
							<h1>Crawl Management</h1>
						</Column>
					</Row>
					<Crawls_Table />
				</Layout>
			);
		}
	});
});