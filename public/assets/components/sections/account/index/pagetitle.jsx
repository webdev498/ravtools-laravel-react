define([
	'react',
	'jsx!components/sections/account/index/pagetitle',
	'jsx!components/common/pagetitle',
	'jsx!components/common/breadcrumb',
	'jsx!components/common/column',
	'jsx!components/common/row'
], function(
	React,
	Account_PageTitle,
	PageTitle,
	Breadcrumb,
	Column,
	Row
) {
	return React.createClass({
		render: function() {
			return (
				<div id="account-pagetitle">
					<Breadcrumb label="Back to Site List" url="#sites" />
					<PageTitle>
						<Row>
							<Column width="12">
								<h1>My Account</h1>
							</Column>
						</Row>
					</PageTitle>
				</div>
			);
		}
	});
});