define([
	'react',
	'request',
	'backbone',
	'underscore',
	'event',
	'jsx!components/admin/sections/accounts/account/modal_extrapages',
	'jsx!components/common/modal',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/text',
	'jsx!components/common/button'
], function(
	React,
	Request,
	Backbone,
	_,
	Event,
	Modal_ExtraPages,
	Modal,
	Row,
	Column,
	Text,
	Button
) {
	return React.createClass({
		componentWillMount: function() {
			Event.add('app.extrapages_modal.show', this.showModal);
			Event.add('app.extrapages_modal.hide', this.hideModal);
		},

		componentWillUnmount: function() {
			Event.remove('app.extrapages_modal.show', this.showModal);
			Event.remove('app.extrapages_modal.hide', this.hideModal);
		},

		showModal: function(event) {
			var self = this;
			var modal = React.findDOMNode(self);

			$(modal).modal('show');
		},

		hideModal: function(event) {
			var modal = React.findDOMNode(this);

			$(modal).modal('hide');
		},

		handleUpdate: function () {
			var self = this,
				modal = React.findDOMNode(this),
				form = $(modal).find('form:first'),
				total = $(form).find('#total'),
				total_value = $(total).val();

			Request.put('/admin/accounts/account/extra_pages', {
				data: {
					'account_id': self.props.account_id,
					'total': total_value
				},
				onSuccess: function(response) {
					self.hideModal();
					
					Event.fire('account.updated');
				}
			});
		},

		render: function() {
			var self = this;

			var buttonSubmit = {
				label: 'Update Pages',
				buttonClass: 'btn-default btn-phone-wide',
				onClick: function (event) {
					self.handleUpdate();
				}
			};

			return (
				<Modal id="extrapages-modal" title="Change Purchased (Extra) Pages" onHide={this.hideModal}>
					<form>
						<Row>
							<Column width="12">
								<Row className="modal-bg">
									<div>
										<p>Think of a number between 0 and not 0. Put that number in the box and press the button.</p>
										<div className="form-group">
											<input id="total" className="form-control" defaultValue={this.props.total} />
										</div>
									</div>
									<div className="btn-toolbar">
										<Button parent_id="extrapages-modal" options={buttonSubmit} />
									</div>
								</Row>
							</Column>
						</Row>
					</form>
				</Modal>
			);
		}
	});
});
