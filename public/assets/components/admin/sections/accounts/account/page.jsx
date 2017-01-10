define([
	'react',
	'underscore',
	'jquery',
	'moment',
	'auth',
	'event',
	'request',
	'jsx!components/admin/sections/accounts/account/page',
	'jsx!components/admin/sections/accounts/account/sites_table',
	'jsx!components/admin/layouts/page',
	'jsx!components/admin/sections/accounts/account/modal_extrapages',
	'jsx!components/common/loading',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/breadcrumb',
	'jsx!components/common/link',
	'jsx!components/common/panel',
	'jsx!components/common/date',
	'jsx!components/common/button'
], function(
	React,
	_,
	$,
	Moment,
	Auth,
	Event,
	Request,
	Page,
	Sites_Table,
	Layout,
	Modal_ExtraPages,
	Loading,
	Row,
	Column,
	Breadcrumb,
	Link,
	Panel,
	Date,
	Button
) {
	return React.createClass({
		getInitialState: function () {
			return {
				account: null
			};
		},

		componentWillMount: function () {
			this.getAccount(this.props.account_id);

			Event.add('account.updated', this.getAccount);
		},

		componentWillUnmount: function () {
			Event.remove('account.updated', this.getAccount);
		},

		getAccount: function () {
			var self = this;

			Request.get('/admin/accounts/account', {
				data: {
					'account_id': this.props.account_id
				},

				onSuccess: function(data) {
					self.setState({
						account: data
					});
				}
			});
		},

		render: function() {
			var account = this.state.account;
			var date_format = "MMM D, YYYY (HH:mm)";
			var modals = [];

			if (!_.isObject(account)) {
				return (
					<Layout id="account-page" className="single-page">
						<Breadcrumb />
						<Loading />
					</Layout>
				);
			}

			modals = [
				<Modal_ExtraPages account_id={account.id} total={account.package.extra_pages_remaining} />
			];

			return (
				<Layout id="account-page" className="single-page" modals={modals}>
					<Breadcrumb />
					<Row>
						<Column width="12">
							<h1>{account.name} <small>Account</small></h1>
						</Column>
					</Row>
					<Row>
						<Column width="3">
							<Panel title="General">
								<dl>
									<dt>ID</dt>
									<dd>{account.id}</dd>

									<dt>Name</dt>
									<dd>{account.name}</dd>

									<dt>Email</dt>
									<dd>{account.email}</dd>

									<dt>Status</dt>
									<dd>{account.status == 1 ? 'Active' : 'Inactive'}</dd>

									<dt>Last Activity</dt>
									<dd>
										<Date ts={account.updated_ts} format={date_format} />
									</dd>

									<dt>Created</dt>
									<dd>
										<Date ts={account.created_ts} format={date_format} />
									</dd>
								</dl>
							</Panel>

							<Panel title="External">
								<dl>
									<dt>Billing (Stripe)</dt>
									<dd>
										<Link options={ {
											'id': 'stripe_link',
											'icon': 'glyphicon glyphicon-share',
											'label': 'View on Stripe',
											'url': 'https://dashboard.stripe.com/test/customers/' + account.stripe_customer_id,
											'target': '_blank'
										}} />
									</dd>

									<dt>Auth (Auth0)</dt>
									<dd>
										<Link options={ {
											'id': 'auth0_link',
											'icon': 'glyphicon glyphicon-share',
											'label': 'Search on Auth0',
											'url': 'https://manage.auth0.com/#/users',
											'target': '_blank'
										}} />
									</dd>
								</dl>
							</Panel>

							<Panel title="Package Details">
								<dl>
									<dt>Plan</dt>
									<dd>{account.package.name}</dd>

									<dt>Remaining Pages From Plan</dt>
									<dd>
										{account.package.billing_pages_remaining}
									</dd>

									<dt>Remaining Extra (Purchased) Pages</dt>
									<dd>
										{account.package.extra_pages_remaining}  

										<Link options={ {
											'label': 'Change',

											'onClick': function () {
												Event.fire('app.extrapages_modal.show');
											}
										} } />
									</dd>
								</dl>
							</Panel>
						</Column>

						<Column width="9">
							<section>
								<h3>Sites</h3>
								<Sites_Table account_id={this.props.account_id} />
							</section>
						</Column>
					</Row>
				</Layout>
			);
		}
	});
});