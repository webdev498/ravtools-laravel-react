define([
	'react',
	'underscore',
	'auth',
	'jsx!components/app/message_upgraded',
	'jsx!components/common/message'
], function(
	React,
	_,
	Auth,
	Message_Upgraded,
	Message
) {
	return React.createClass({
		checkMessage: function() {
			var messageFlag = localStorage.getItem('message_AccountUpgraded');

			if (!_.isNull(messageFlag) && messageFlag) {
				localStorage.removeItem('message_AccountUpgraded');

				return (
					<Message type="success">
						<p>You upgraded!  You can now finish analyzing the rest of your site.</p>
					</Message>
				);
			}

			return null;
		},

		render: function() {
			return this.checkMessage();
		}
	});
});