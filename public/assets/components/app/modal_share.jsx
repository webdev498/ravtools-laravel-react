define([
	'react',
	'request',
	'backbone',
	'underscore',
	'event',
	'clipboard',
	'jsx!components/app/modal_share',
	'jsx!components/common/modal',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/text',
	'jsx!components/common/icon',
	'jsx!components/common/button'
], function(
	React,
	Request,
	Backbone,
	_,
	Event,
	Clipboard,
	Modal_Share,
	Modal,
	Row,
	Column,
	Text,
	Icon,
	Button
) {
	return React.createClass({
		getInitialState: function() {
			return {
				url: 'Generating...'
			}
		},

		componentWillMount: function() {
			Event.add('app.share_modal.show', this.showModal);
			Event.add('app.share_modal.hide', this.hideModal);
		},

		componentWillUnmount: function() {
			Event.remove('app.share_modal.show', this.showModal);
			Event.remove('app.share_modal.hide', this.hideModal);
		},

		showModal: function(event) {
			var self = this;
			var modal = React.findDOMNode(self);

			var redirect_url = window.location.hash;

			// this should likely never be the case, but accounting for it anyways
			if (_.isString(window.location.search) && window.location.search != '') {
				redirect_url += '?' + window.location.search;
			}

			Request.get('/auditor/sites/site/hash', {
				data: {
					'site_id': self.props.site_id,
					'redirect_url': redirect_url
				},
				onSuccess: function(data) {
					self.setState({
						url: window.location.origin + '/#s/' + data.id
					});
				}
			});

			$(modal).modal('show');
		},

		hideModal: function(event) {
			var modal = React.findDOMNode(this);

			$(modal).modal('hide');
		},

		handleCopy: function(event) {
			new Clipboard(event.target, {
				target: function(trigger) {
					return document.getElementById('share_link');
				}
			});

			$(event.target).trigger('click');
		},

		handleRemove: function() {
			var self = this;

			this.hideModal();

			Request.delete('/auditor/sites/site/hash', {
				data: {
					'site_id': self.props.site_id,
					'share_id': self.state.url.replace(/^(.*?\#s\/)/, '')
				},
				onSuccess: function(response) {
					//nada
				}
			});

		},

		render: function() {
			var self = this;

			var buttonRemove = {
				label: 'Remove Link',
				buttonClass: 'btn-default btn-phone-wide',
				onClick: function (event) {
					self.handleRemove();
				}
			};

			var buttonCopy = {
				label: 'Copy Link',
				buttonClass: 'btn-primary btn-phone-wide',
				onClick: function(event) {
					self.handleCopy(event);
				}
			};

			return (
				<Modal id="share-modal" title="Sharing" onHide={this.hideModal}>
					<form>
						<Row>
							<Column width="12">
								<Row className="modal-bg">
									<div>
										<p><strong>Anyone with this link be able to view your website score data.</strong></p>
										<div className="form-group">
											<input id="share_link" className="form-control" value={this.state.url} readOnly={true} />
										</div>
									</div>
									<div className="btn-toolbar">
										<Button parent_id="share-modal" options={buttonRemove} />
										<Button parent_id="share-modal" options={buttonCopy} />
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
