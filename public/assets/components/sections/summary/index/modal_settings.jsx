define([
	'react',
	'event',
	'underscore',
	'jsx!components/sections/summary/index/modal_settings',
	'jsx!components/sections/summary/index/form_excludepaths',
	'jsx!components/sections/summary/index/form_excludeissues',
	'jsx!components/common/modal',
	'jsx!components/common/row',
	'jsx!components/common/column'
], function(
	React,
	Event,
	_,
	Modal_Settings,
	Form_Paths,
	Form_Issues,
	Modal,
	Row,
	Column
) {
	return React.createClass({
		getInitialState: function() {
			return {
				refreshNeeded: false
			}
		},

		componentWillMount: function() {
			Event.add('summary.settings_modal.show', this.showModal);
			Event.add('summary.settings_modal.hide', this.hideModal);
			Event.add('summary.settings_modal.updated', this.handleUpdate);
		},

		componentWillUnmount: function() {
			Event.remove('summary.settings_modal.show', this.showModal);
			Event.remove('summary.settings_modal.hide', this.hideModal);
			Event.remove('summary.settings_modal.updated', this.handleUpdate);
		},

		handleUpdate: function() {
			this.setState({
				refreshNeeded: true
			});
		},

		showModal: function(event) {
			var modal = React.findDOMNode(this);

			$(modal).modal('show');
		},

		hideModal: function(event) {
			var modal = React.findDOMNode(this);

			if (this.state.refreshNeeded == true) {
				Event.fire('summary.refresh');

				this.setState({
					refreshNeeded: false
				});
			}

			$(modal).modal('hide');
		},

		render: function() {
			var self = this;

			var buttons = [
				{
					label: 'All Done',
					buttonClass: 'btn-primary btn-phone-wide',
					onClick: function(event) {
						self.hideModal();
					}
				}
			];

			return (
				<Modal id="settings-modal" title="Settings" buttons={buttons} onHide={this.hideModal}>
					<Row>
						<Column width="12">
							<Form_Issues site_id={this.props.site_id} />
						</Column>
					</Row>
					<Row>
						<Column width="12">
							<Form_Paths site_id={this.props.site_id} />
						</Column>
					</Row>
				</Modal>
			);
		}
	});
});
