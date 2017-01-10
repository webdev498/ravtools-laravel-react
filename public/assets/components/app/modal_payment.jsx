define([
	'react',
	'auth',
	'request',
	'underscore',
	'validate',
	'event',
	'jsx!components/app/modal_payment',
	'jsx!components/common/modal',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/form',
	'jsx!components/common/button',
	'jsx!components/common/text',
	'jsx!components/common/link'
], function(
	React,
	Auth,
	Request,
	_,
	validate,
	Event,
	Modal_Payment,
	Modal,
	Row,
	Column,
	Form,
	Button,
	Text,
	Link
) {
	return React.createClass({
		handler: null,
		onSuccess: null,

		componentWillMount: function() {
			var test_publishable_key = 'pk_test_FAK52gw0D0LbryPQLdaaiekB',
	    		live_publishable_key = 'pk_live_XERjBhU80wHM0BJDKvB6koNc',
	    		publishable_key = test_publishable_key;

	    	if (window.location.hostname === 'auditor.raventools.com') { // TODO change to config option
	    		publishable_key = live_publishable_key;
	    	}

			var stripeOptions = {
			    key: publishable_key,
			    color: 'black',
			    image: '/assets/img/icons/apple-touch-icon-60x60.png',
			    locale: 'auto',
			    // bitcoin: true, // lel, requires an amount
			    token: this.handleToken
			};

			var profile = Auth.getProfile();
			if (_.isObject(profile) && profile.hasOwnProperty('email') && _.isString(profile.email)) {
				stripeOptions.email = profile.email;
			}

	    	this.handler = StripeCheckout.configure(stripeOptions);

			Event.add('app.payment_modal.show', this.showModal);
			Event.add('app.payment_modal.hide', this.hideModal);

			Event.add('app.payment_modal.success', this.handleSuccess);
			Event.add('app.payment_modal.error', this.handleError);
		},

		componentWillUnmount: function() {
			Event.remove('app.payment_modal.show', this.showModal);
			Event.remove('app.payment_modal.hide', this.hideModal);

			Event.remove('app.payment_modal.success', this.handleSuccess);
			Event.remove('app.payment_modal.error', this.handleError);
		},

		showModal: function(event) {
			var handler_options = {
				name: 'Raven Tools'
			};

		    event.preventDefault();

			if (_.isObject(event.detail)) {
				if (event.detail.hasOwnProperty('description') && _.isString(event.detail.description)) {
					handler_options.description = event.detail.description;
				}

				if (event.detail.hasOwnProperty('amount') && _.isNumber(event.detail.amount)) {
					handler_options.amount = event.detail.amount;
				}

				if (event.detail.hasOwnProperty('onSuccess') && _.isFunction(event.detail.onSuccess)) {
					this.onSuccess = event.detail.onSuccess;
				}
			}

			this.handler.open(handler_options);
		},

		hideModal: function(event) {
			this.handler.close();
		},

		handleToken: function (token) {
			var self = this;

			Request.post('/billing/cards/card', {
				data: {
					card_token: token.id
				},

				onSuccess: function (data) {
					if (data.error) {
						Event.fire('app.payment_modal.error', {
							error: data.error
						});

						return false;
					}

					if (_.isFunction(self.onSuccess)) {
						self.onSuccess();
					}
					
					Event.fire('app.payment_modal.success', {
						'card_id': data.id
					});
				},

				onError: function (data) {
					Event.fire('app.payment_modal.error', {
						error: data
					});
				}
			});
		},

		handleSuccess: function () {
			Event.fire('app.alert.hide', {
				tag: 'app.payment'
			});
		},

		handleError: function(event) {
			Event.fire('app.alert.show', {
				tag: 'app.card_failed',
				type: 'danger',
				persist: false,
				message: (
					<p>
						<strong>Error</strong>
						{event.detail.error}
					</p>
				)
			});
		},

		render: function() {
			var buttonPay = {
				label: 'Pay Now',
				buttonClass: 'btn-primary'
			};

			return (
				<Modal id="payment-modal" title="Enter Payment Information" hideLabel="Cancel" onHide={this.hideModal}>
					<Form onSubmit={this.handlePayment} onValidate={this.handleValidate}>
						<Row>
							<Column width="12">
								<Row className="modal-bg">
									<div className="form-group">
										<Text name="cc_number" type="number" placeholder="Card number" />
									</div>
									<div className="form-group">
										<Text name="cc_exp" placeholder="MM/YY" />
									</div>
									<div className="form-group">
										<Text name="cc_cvc" type="number" placeholder="CVC" />
									</div>
									<div className="btn-toolbar">
										<Button type="submit" options={buttonPay} />
									</div>
								</Row>
							</Column>
						</Row>
					</Form>
				</Modal>
			);
		}
	});
});
