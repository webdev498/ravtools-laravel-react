define([
	'react',
	'event',
	'request',
	'underscore',
	'jsx!components/sections/account/index/modal_downgrade',
	'jsx!components/sections/account/index/plangrid',
	'jsx!components/common/modal',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/button'
], function(
	React,
	Event,
	Request,
	_,
	Modal_Downgrade,
	PlanGrid,
	Modal,
	Row,
	Column,
	Button
) {
	return React.createClass({
		getInitialState: function() {
			return {
				sites: null
			}
		},

		componentWillMount: function() {
			this.getSites();

			Event.add('account.downgrade_modal.show', this.showModal);
			Event.add('account.downgrade_modal.hide', this.hideModal);
		},

		componentWillUnmount: function() {
			Event.remove('account.downgrade_modal.show', this.showModal);
			Event.remove('account.downgrade_modal.hide', this.hideModal);
		},

		getSites: function() {
			var self = this;

			Request.get('/auditor/sites', {
				onSuccess: function(data) {
					self.setState({
						sites: data.data
					})
				}
			});
		},

		showModal: function() {
			var modal = React.findDOMNode(this);

			$(modal).modal('show');
		},

		hideModal: function() {
			var modal = React.findDOMNode(this);

			$(modal).modal('hide');
		},

		render: function() {
			var plan = this.props.plan || null;
			var sites = this.state.sites || null;

			if (_.isNull(plan) || _.isNull(sites)) {
				return false;
			}

			var planType = plan.type;

			var content = null;
			if ((planType === 'grow' || planType === 'pro') && sites.length > 1) {
				content = (
					<p>You will need to remove all but 1 site in order to downgrade your account to Grow or Free.</p>
				);
			}
			else {
				content = (
					<PlanGrid plan={plan} action="downgrade" />
				);
			}

			return (
				<Modal id="downgrade-modal" title="Downgrade" onHide={this.hideModal}>
					<form>
						<Row>
							<Column width="12">
								{content}
							</Column>
						</Row>
					</form>
				</Modal>
			);
		}
	});
});