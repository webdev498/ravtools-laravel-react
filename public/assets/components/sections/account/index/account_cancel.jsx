define([
	'react',
	'underscore',
	'event',
	'jsx!components/sections/account/index/account_cancel',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/button'
], function(
	React,
	_,
	Event,
	Account_Cancel,
	Row,
	Column,
	Button
) {
	return React.createClass({
		render: function() {
			var plan = this.props.plan || null;

			if (_.isNull(plan)) {
				return null;
			}

			var planType = plan.type;

			var message = null;
			var buttonDowngradeAccount = null;
			if (planType === "free") {
				message = "You can cancel your account completely.  The benefit of keeping a Free account is that you can keep using it or come back later when you're ready to use it again.";
			}
			else {
				message = "You have the option to either downgrade to a Free account or cancel it completely.  The benefit of keeping a Free account is that you can keep using it or come back later when you're ready to use it again.";
				buttonDowngradeAccount = (
					<Button options={ {
						label: 'Downgrade',
						buttonClass: 'btn-primary btn-phone-wide',
						onClick: function() {
							Event.fire('account.downgrade_modal.show');
						}
					} } />
				);
			}

			var buttonCancelAccount = {
				label: 'Cancel Account',
				buttonClass: 'btn-default btn-phone-wide',
				onClick: function() {
					Event.fire('account.cancel_modal.show');
				}
			};

			return (
				<section id="account-cancel">
					<Row>
						<Column width="12">
							<h5>Close Account</h5>
						</Column>
					</Row>
					<Row>
						<Column width="12">
							<p>{message}</p>
							<div className="btn-toolbar">
								{buttonDowngradeAccount}
								<Button options={buttonCancelAccount} />
							</div>
						</Column>
					</Row>
				</section>
			);
		}
	});
});