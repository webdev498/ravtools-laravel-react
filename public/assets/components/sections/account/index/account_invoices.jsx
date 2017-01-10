define([
	'react',
	'underscore',
	'jsx!components/sections/account/index/account_invoices',
	'jsx!components/sections/account/index/table',
	'jsx!components/common/row',
	'jsx!components/common/column'
], function(
	React,
	_,
	Account_Invoices,
	Table_Invoices,
	Row,
	Column
) {
	return React.createClass({
		render: function() {
			var plan = this.props.plan || null;

			if (_.isNull(plan)) {
				return false;
			}

			var planType = plan.type;

			if (planType === 'free') {
				return null;
			}
			else {
				return (
					<section id="account-invoices">
						<Row>
							<Column width="12">
								<h5>Purchase History</h5>
							</Column>
						</Row>
						<Table_Invoices />
					</section>
				);
			}
		}
	});
});
