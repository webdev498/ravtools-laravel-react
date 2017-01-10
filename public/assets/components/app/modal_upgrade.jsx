define([
	'react',
	'underscore',
	'event',
	'jsx!components/app/modal_upgrade',
	'jsx!components/common/modal',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/button'
], function(
	React,
	_,
	Event,
	Modal_Upgrade,
	Modal,
	Row,
	Column,
	Button
) {
	return React.createClass({
		componentWillMount: function() {
			Event.add('app.upgrade_modal.show', this.showModal);
			Event.add('app.upgrade_modal.hide', this.hideModal);
		},

		componentWillUnmount: function() {
			Event.remove('app.upgrade_modal.show', this.showModal);
			Event.remove('app.upgrade_modal.hide', this.hideModal);
		},

		showModal: function(event) {
			var modal = React.findDOMNode(this);

			$(modal).modal('show');
		},

		hideModal: function(event) {
			var modal = React.findDOMNode(this);

			$(modal).modal('hide');
		},

		render: function() {
			var options = {
				label: 'Upgrade Now',
				buttonClass: 'btn-primary btn-phone-wide',
				onClick: function() {
					Router.navigate('#account', {trigger: true});
				}
			};

			return (
				<Modal id="upgrade-modal" title="Upgrade" hideLabel="Cancel" onHide={this.hideModal}>
					<Row>
						<Column width="12">
							<Row className="modal-bg">
								<h3>Upgrade your plan to analyze more sites.</h3>
								<Button parent_id="upgrade-modal" options={options} />
							</Row>
						</Column>
					</Row>
				</Modal>
			);
		}
	});
});