define([
	'react',
	'auth',
	'event',
	'moment',
	'jsx!components/sections/account/index/account_details',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/button',
	'jsx!components/common/link'
], function(
	React,
	Auth,
	Event,
	Moment,
	Account_Details,
	Row,
	Column,
	Button,
	Link
) {
	return React.createClass({
		render: function() {
			var plan = this.props.plan || null;
			var profile = Auth.getProfile();

			if (_.isNull(plan)) {
				return false;
			}

			var planType = plan.type;

			var signedUp = Moment(profile.created_at);
			signedUp = signedUp.format('MM/DD/YYYY');

			var extraPages = null,
				changeInfo = null,
				buyMore = null;

			if (plan.hasOwnProperty('extra_pages_remaining') && plan.extra_pages_remaining != 0) {
				extraPages = (
					<div>
						<p>
						Additional purchased pages remaining:
							<span className="pull-right">
								<strong>{plan.extra_pages_remaining}</strong>
							</span>
						</p>
					</div>
				);
			}

			if (planType == 'grow' || planType == 'pro') {
				var nextBilling = Moment.unix(plan.next_billing_ts);
				nextBilling = nextBilling.format('MM/DD/YYYY');

				/*
				changeInfo = (
					<div>
						<p>
						Next billing date:
							<span className="pull-right">
								<strong>{nextBilling}</strong>
							</span>
						</p>
						<p>
							<Link options={ {
								label: 'Change payment information',
								onClick: function() {
									Event.fire('account.changeinfo');
								}
							} } />
						</p>
					</div>
				);
				*/
				changeInfo = (
					<div>
						<p>
						Next billing date:
							<span className="pull-right">
								<strong>{nextBilling}</strong>
							</span>
						</p>
					</div>
				);

				/*
				if (planType == 'pro') {
					buyMore = (
						<div>
							<Button options={ {
								label: 'Buy More Pages',
								buttonClass: 'btn-primary',
								onClick: function() {
									Event.fire('account.buymore_modal.show');
								}
							} } />
						</div>
					);
				}
				*/
			}

			return (
				<section id="account-details">
					<Row>
						<Column width="12">
							<h5>Account Details</h5>
						</Column>
					</Row>
					<Row className="details-wrapper">
						<Column className="details-column" width="4">
							<p>
								<strong>{profile.name}</strong>
							</p>
							<p>{profile.email}</p>
						</Column>

						<Column className="details-column" width="4">
							<p>
							Signed up on:
								<span className="pull-right">
									<strong>{signedUp}</strong>
								</span>
							</p>
							{changeInfo}
						</Column>

						<Column className="details-column" width="4">
							<p>
							Pages remaining for billing period:
								<span className="pull-right">
									<strong>{plan.billing_pages_remaining}</strong>
								</span>
							</p>
							{extraPages}
							{buyMore}
						</Column>
					</Row>
				</section>
			)
		}
	});
});