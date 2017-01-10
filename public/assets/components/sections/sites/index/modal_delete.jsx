define([
	'react',
	'underscore',
	'jquery',
	'event',
	'request',
	'jsx!components/common/modal',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/button'
], function(
	React,
	_,
	$,
	Event,
	Request,
	Modal,
	Row,
	Column,
	Button
) {
	return React.createClass({
		getInitialState: function() {
			return {
				site_id: null,
				url: null
			}
		},

		componentWillMount: function () {
			Event.add('sites.delete_modal.show', this.showModal);
			Event.add('sites.delete_modal.hide', this.hideModal);
		},

		componentWillUnmount: function () {
			Event.remove('sites.delete_modal.show', this.showModal);
			Event.remove('sites.delete_modal.hide', this.hideModal);
		},

		showModal: function (event) {
			var modal = React.findDOMNode(this);

			this.setState({
				site_id: event.detail.id,
				url: event.detail.url
			});

			$(modal).modal('show');
		},

		hideModal: function () {
			var modal = React.findDOMNode(this);

			$(modal).modal('hide');
		},

		processDeleteWebsite: function () {
			var data = {
				'site_id': this.state.site_id
			};

			this.submitDeleteWebsite(data);
		},

		submitDeleteWebsite: function (request_data) {
			var self = this;

			Event.fire('sites.deleted', {
				site_id: request_data.site_id
			});

			Request.delete('/auditor/sites/site', {
				data: {
					'site_id': request_data.site_id
				},
				onSuccess: function () {
					self.handleSuccess();
				},

				onFailure: function () {
					self.handleError();
				}
			});
		},

		submit: function() {
			this.processDeleteWebsite();
			this.hideModal();
		},

		handleSuccess: function() {
			Event.fire('sites.deleted.success');
		},

		handleError: function(event) {
			var options = {
				label: 'Retry',
				onClick: function() {
					Event.fire('sites.delete_modal.show', {
						settings: event.detail.settings
					});
				}
			};

			Event.fire('sites.deleted.error.' + this.state.site_id);

			Event.fire('app.alert.show', {
				tag: 'sites.delete_site',
				type: 'danger',
				persist: true,
				message: (
					<p>
						<strong>Error</strong>
						Whoops, let's try that again.<br /><Link options={options} />
					</p>
				)
			});
		},

		render: function() {
			var self = this;

			var buttonDelete = {
				label: 'Delete',
				buttonClass: 'btn-primary btn-phone-wide',

				onClick: function (event) {
					self.submit();
				}
			};

			var buttonCancel = {
				label: 'Cancel',
				buttonClass: 'btn-default btn-phone-wide',

				onClick: function(event) {
					self.hideModal();
				}
			};

			return (
				<Modal id="delete-modal" title="Delete" onHide={this.hideModal}>
					<form>
						<Row>
							<Column width="12">
								<Row className="modal-bg">
									<div>
										<p>Are you sure you want to delete <strong>{self.state.url}</strong>{'?'}</p>
									</div>
									<div className="btn-toolbar">
										<Button parent_id="delete-modal" options={buttonDelete} />
										<Button parent_id="delete-modal" options={buttonCancel} />
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
