define([
	'react',
	'jsx!components/sections/share/index/pagetitle',
	'jsx!components/common/pagetitle',
	'jsx!components/common/column',
	'jsx!components/common/row'
], function(
	React,
	Account_PageTitle,
	PageTitle,
	Column,
	Row
) {
	return React.createClass({
		render: function() {
			return (
				<div id="account-pagetitle">
					<PageTitle>
						<Row>
							<Column width="12">
								
							</Column>
						</Row>
					</PageTitle>
				</div>
			);
		}
	});
});