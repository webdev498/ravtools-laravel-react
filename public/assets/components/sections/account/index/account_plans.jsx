define([
	'react',
	'underscore',
	'jsx!components/sections/account/index/account_plans',
	'jsx!components/sections/account/index/plangrid',
	'jsx!components/common/row'
], function(
	React,
	_,
	Account_Plans,
	PlanGrid,
	Row
) {
	return React.createClass({
		render: function() {
			return (
				<section id="account-plans">
					<PlanGrid plan={this.props.plan} action="upgrade" />
				</section>
			);
		}
	});
});
