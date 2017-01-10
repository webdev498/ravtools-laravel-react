define([
	'react',
	'event',
	'auth',
	'request',
	'underscore',
	'validate',
	'jsx!components/sections/account/index/modal_cancel',
	'jsx!components/common/modal',
	'jsx!components/common/row',
	'jsx!components/common/form',
	'jsx!components/common/column',
	'jsx!components/common/icon',
	'jsx!components/common/text',
	'jsx!components/common/button',
	'jsx!components/common/link',
], function(
	React,
	Event,
	Auth,
	Request,
	_,
	validate,
	Modal_Cancel,
	Modal,
	Row,
	Form,
	Column,
	Icon,
	Text,
	Button,
	Link
) {
	return React.createClass({
		componentWillMount: function() {
			Event.add('account.cancel_modal.show', this.showModal);
			Event.add('account.cancel_modal.hide', this.hideModal);
			Event.add('account.cancel', this.cancelAccount);
		},

		componentWillUnmount: function() {
			Event.remove('account.cancel_modal.show', this.showModal);
			Event.remove('account.cancel_modal.hide', this.hideModal);
			Event.remove('account.cancel', this.cancelAccount);
		},

		showModal: function() {
			var modal = React.findDOMNode(this);

			$(modal).modal('show');
		},

		hideModal: function() {
			var modal = React.findDOMNode(this);

			$(modal).modal('hide');
		},

		handleValidate: function(inputs) {
			return validate(inputs, {
				cancel_reason: {
					presence: true
				}
			});
		},

		handleSubmit: function(inputs) {
			this.hideModal();

			Event.fire('account.cancel', inputs);
		},

		cancelAccount: function (evt) {
			var inputs = {};

			if (_.isObject(evt) && _.isObject(evt.detail)) {
				inputs = evt.detail;
			}

			Request.post('/billing/customers/cancel', {
				data: inputs,
				onSuccess: function (data) {
					if (data.hasOwnProperty('error')) {
						var options = {
							label: 'Retry',
							onClick: function() {
								Event.fire('app.payment_modal.show', {
									settings: event.detail.settings
								});
							}
						};

						Event.fire('app.alert.show', {
							tag: 'app.cancel',
							type: 'danger',
							persist: true,
							message: (
								<p>
									<strong>Error</strong>
									{data.error}<br /><Link options={options} />
								</p>
							)
						});

						return false;
					}

					Auth.handleLogout();
				}
			});
		},

		render: function() {
			var buttonCancel = {
				label: 'Permanently Delete Account',
				buttonClass: 'btn-danger btn-phone-wide'
			};

			return (
				<Modal id="cancel-modal" title="Cancel Account" onHide={this.hideModal}>
					<Form onValidate={this.handleValidate} onSubmit={this.handleSubmit}>
						<Row>
							<Column width="12">
								<h4>We're sorry to see you go &#9785; Please take a moment to tell us why you're leaving.</h4>
								<Text name="cancel_reason" label="Reason for cancelling account" />
								<Button parent_id="cancel-modal" type="submit" options={buttonCancel} />
							</Column>
						</Row>
					</Form>
				</Modal>
			);
		}
	});
});