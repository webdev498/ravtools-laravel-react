define([
	'react',
	'event',
	'jsx!components/sections/account/index/modal_buymore',
	'jsx!components/common/modal',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/button'
], function(
	React,
	Event,
	Modal_BuyMore,
	Modal,
	Row,
	Column,
	Button
) {
	return React.createClass({
		componentWillMount: function() {
			Event.add('account.buymore_modal.show', this.showModal);
			Event.add('account.buymore_modal.hide', this.hideModal);
		},

		componentWillUnmount: function() {
			Event.remove('account.buymore_modal.show', this.showModal);
			Event.remove('account.buymore_modal.hide', this.hideModal);
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
			var self = this;

			var buttonBuyNow = {
				label: 'Buy Now',
				buttonClass: 'btn-primary',
				onClick: function() {
					self.hideModal();
					Event.fire('account.buymore');
				}
			};

			return (
				<Modal id="buymore-modal" title="Buy More Pages" onHide={this.hideModal}>
					<form>
						<Row>
							<Column width="12">
								<p>As a Pro user, you can purchase additional pages that will only be used when you hit your monthly limit.  Unused pages automatically rollover to the next billing month, so you never have to worry about losing them if you don't use them.</p>
								<h4>Price: <strong>$49</strong> for 50,000 pages.</h4>
								<Button parent_id="buymore-modal" options={buttonBuyNow} />
							</Column>
						</Row>
					</form>
				</Modal>
			);
		}
	});
});