define([
	'react',
	'underscore',
	'auth',
	'request',
	'event',
	'jsx!components/sections/account/index/page',
	'jsx!components/sections/account/index/pagetitle',
	'jsx!components/sections/account/index/account_details',
	'jsx!components/sections/account/index/account_plans',
	'jsx!components/sections/account/index/account_invoices',
	'jsx!components/sections/account/index/account_cancel',
	'jsx!components/sections/account/index/modal_buymore',
	'jsx!components/sections/account/index/modal_downgrade',
	'jsx!components/sections/account/index/modal_cancel',
	'jsx!components/app/modal_payment',
	'jsx!components/layouts/page',
	'jsx!components/common/column',
	'jsx!components/common/loading'
], function(
	React,
	_,
	Auth,
	Request,
	Event,
	Page,
	PageTitle,
	Account_Details,
	Account_Plans,
	Account_Invoices,
	Account_Cancel,
	Modal_BuyMore,
	Modal_Downgrade,
	Modal_Cancel,
	Modal_Payment,
	Layout,
	Column,
	Loading
) {
	return React.createClass({
		getInitialState: function() {
			return {
				plan: null
			}
		},

		componentWillMount: function() {
			this.getPlan();

			Event.add('account.changeinfo', this.handleChangeInfo);
			Event.add('account.upgrade', this.handleUpgrade);
			Event.add('account.downgrade', this.handleDowngrade);
			Event.add('account.buymore', this.handleBuyMore);
			Event.add('account.plan_change', this.changePlan);
		},

		componentWillUnmount: function() {
			Event.remove('account.changeinfo', this.handleChangeInfo);
			Event.remove('account.upgrade', this.handleUpgrade);
			Event.remove('account.downgrade', this.handleDowngrade);
			Event.remove('account.buymore', this.handleBuyMore);
			Event.remove('account.plan_change', this.changePlan);
		},

		getCards: function (options) {
			var self = this;

			Request.get('/billing/cards', {
				onSuccess: function(data) {
					if (_.isObject(options) && _.isFunction(options.callback)) {
						options.callback(data);
					}
				}
			});			
		},

		getPlan: function(callback) {
			var self = this;

			Request.get('/billing/plans/plan', {
				onSuccess: function(data) {
					self.setState({
						plan: data
					});

					Auth.setServicePlan(data);

					if (_.isFunction(callback)) {
						callback(data);
					}
				}
			});
		},

		changePlan: function (event) {
			this.setState({
				plan: event.detail.plan
			});
		},

		handleChangeInfo: function(event) {
			//todo: Handle a request to change payment info
			console.log('changeinfo', event.detail);
		},

		handleUpgrade: function(event) {
			var self = this;

			var upgradePost = function () {
				Request.post('/billing/plans/upgrade', {
					data: {
						plan: event.detail.plan	
					},

					onSuccess: function (data) {
						if (data.hasOwnProperty('failure')) {
							switch (data.failure) {
								case 'payment':
									Event.fire('app.payment_modal.show', {
										'plan': event.detail.plan
									});

									break;
							}

							return false;
						}

						self.getPlan(function() {
							localStorage.setItem('message_AccountUpgraded', true);
							Router.navigate('#sites', {trigger:true});
						});
					}
				});
			};

			this.getCards({
				'callback': function (data) {
					if (!data.hasOwnProperty('data') || !_.isArray(data.data) || data.data.length == 0) {
						Event.fire('app.payment_modal.show', {
							onSuccess: function () {
								upgradePost();
							}
						});

						return false;
					}

					upgradePost();
				}
			});
		},

		handleDowngrade: function(event) {
			var self = this;

			var downgradePost = function () {
				Request.post('/billing/plans/downgrade', {
					data: {
						plan: event.detail.plan	
					},

					onSuccess: function (data) {
						if (data.hasOwnProperty('failure')) {
							switch (data.failure) {
								case 'payment':
									Event.fire('app.payment_modal.show', {
										'plan': event.detail.plan
									});

									break;
							}

							return false;
						}

						self.getPlan();
					}
				});
			};


			if (event.detail.plan == 'free') {
				downgradePost();
			}
			else {
				this.getCards({
					'callback': function (data) {
						if (!data.hasOwnProperty('data') || !_.isArray(data.data) || data.data.length == 0) {
							Event.fire('app.payment_modal.show', {
								onSuccess: function () {
									downgradePost();
								}
							});

							return false;
						}

						downgradePost();
					}
				});
			}
		},

		handleBuyMore: function(event) {
			//todo: Handle a request for Buy More
			console.log('buymore', event.detail);
		},

		render: function() {
			var header = (<PageTitle site_id={this.props.site_id} />);

			var modals = [
				/*(<Modal_BuyMore plan={this.state.plan} />),*/
				(<Modal_Downgrade plan={this.state.plan} />),
				(<Modal_Cancel plan={this.state.plan} />),
				(<Modal_Payment />)
			];

			var content = (
				<Column>
					<Loading />
				</Column>
			);
			if (!_.isEmpty(this.state.plan)) {
				content = (
					<Column>
						<Account_Details plan={this.state.plan} />
						<Account_Plans plan={this.state.plan} />
						<Account_Invoices plan={this.state.plan} />
						<Account_Cancel plan={this.state.plan} />
					</Column>
				);
			}

			return (
				<Layout id="account-page" type="single" header={header} modals={modals}>
					{content}
				</Layout>
			);
		}
	});
});