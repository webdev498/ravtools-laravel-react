define([
	'react',
	'underscore',
	'auth',
	'jsx!components/app/message_outofpages',
	'jsx!components/common/message',
	'jsx!components/common/link'
], function(
	React,
	_,
	Auth,
	Message_OutOfPages,
	Message,
	Link
) {
	return React.createClass({
		checkMessage: function() {
			var plan = Auth.getServicePlan();

			if (_.isObject(plan)) {
				if (plan.hasOwnProperty('name') && plan.hasOwnProperty('billing_pages_remaining') && plan.hasOwnProperty('extra_pages_remaining')) {
					var label, messageCopy = null;

					var plan_type = plan.name.toLowerCase();
					var billing_pages = plan.billing_pages_remaining;
					var extra_pages = plan.extra_pages_remaining;

					if (billing_pages <= 0 && extra_pages <= 0) {
						if (plan_type == 'pro') {
							/*
							 messageCopy = (
								<p>The Pro account is limited to 100,000 pages per month and it looks like you've already hit that limit.<br />Fortunately, Pro accounts have the option to purchase additional pages.<br />Click "Buy More Pages" to add 50,000 more pages to your account.</p>
							 );
							 buttonLabel = 'Buy More Pages';
							 */

							messageCopy = (
								<p>The Pro account is limited to 100,000 pages per month and it looks like you've already hit that limit.<br />In the very near future, you'll be able to purchase additional pages.</p>
							);
							label = 'Account';
						}

						else if (plan_type == 'grow') {
							messageCopy = (
								<p>The Grow account is limited to analyzing 10,000 pages per month and it looks like you've already hit that limit.<br />Fortunately, for only $70 more you can analyze up to 100,000 pages right now!  You can also add more sites to analyze!<br />Click "Upgrade" to finish analyzing your entire site.</p>
							);
							label = 'Upgrade';
						}

						else {
							messageCopy = (
								<p>The Free account is limited to analyzing 20 pages per month and it looks like you've already hit that limit.<br />Fortunately, for only $27 you can analyze up to 10,000 pages right now!<br />Click "Upgrade" to finish analyzing your entire site.</p>
							);
							label = 'Upgrade';
						}

						return (
							<Message type="danger">
								{messageCopy}
								<div className="btn-toolbar">
									<Link className="btn btn-primary btn-phone-wide" options={ {
										label: label,
										url: '#account'
									} } />
								</div>
							</Message>
						);
					}
				}
			}

			return null;
		},

		render: function() {
			return this.checkMessage();
		}
	});
});
