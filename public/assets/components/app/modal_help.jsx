define([
	'react',
	'event',
	'jsx!components/app/modal_help',
	'jsx!components/common/modal',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/link'
], function (
	React,
	Event,
	Modal_Help,
	Modal,
	Row,
	Column,
	Link
) {
	return React.createClass({
		componentWillMount: function() {
			Event.add('app.help_modal.show', this.showModal);
			Event.add('app.help_modal.hide', this.hideModal);
		},

		componentWillUnmount: function() {
			Event.remove('app.help_modal.show', this.showModal);
			Event.remove('app.help_modal.hide', this.hideModal);
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
			return (
				<Modal id="help-modal" title="Help" onHide={this.hideModal}>
					<Row>
						<Column width="12">
							<Row className="modal-bg">
								<div>
									<p><strong>Support Community</strong></p>
									<p>If you have a question about Site Auditor or want to learn more about it, please visit our Support Community.  You can search topics or post a new topic.  The forum is community driven, and the topics are monitored and answered by Raven team members on a regular basis.  You will need to sign up for the forum to post or reply, but we've made it easy to sign up using your Twitter or Facebook account.</p>
									<p>
										<strong>
											<Link options={{
												label: 'Raven Support Community',
												url: 'https://raven.community/t/support',
												icon: 'glyphicon-share',
												updateHash: false
											}} />
										</strong>
									</p>
								</div>
							</Row>
							<Row className="modal-bg">
								<div>
									<p><strong>Feature Requests</strong></p>
									<p>Is there a feature you would love to see in the Site Auditor{'?'} We'd love to hear about it.</p>
									<p>
										<strong>
											<Link options={{
												label: 'Feature Request Submission',
												url: 'https://raven.zendesk.com/hc/en-us/community/topics/200618658-Site-Auditor-Standalone-',
												icon: 'glyphicon-share',
												updateHash: false
											}} />
										</strong>
									</p>
								</div>
							</Row>
							<Row className="modal-bg">
								<div>
									<p><strong>Support Email</strong></p>
									<p>If you're unable to find the answer to your question in the Support Community, you can email us for further assistance.</p>
									<p>
										<strong>
											<Link options={{
												label: 'help.auditor@raventools.com',
												url: 'mailto:help.auditor@raventools.com',
												icon: 'glyphicon-envelope',
												updateHash: false
											}} />
										</strong>
									</p>
								</div>
							</Row>
						</Column>
					</Row>
				</Modal>
			);
		}
	});
});
