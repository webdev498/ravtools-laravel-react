define([
	'react',
	'jquery',
	'underscore',
	'auth',
	'event',
	'jsx!components/common/messages',
	'jsx!components/app/message_outofpages',
	'jsx!components/app/message_upgraded',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/button'
], function(
	React,
	$,
	_,
	Auth,
	Event,
	Messages,
	Message_OutOfPages,
	Message_Upgraded,
	Row,
	Column,
	Button
) {
	return React.createClass({
		componentDidMount: function() {
			this.checkMessages();
		},

		checkMessages: function() {
			var messages = React.findDOMNode(this);

			var checks = [
				(<Message_Upgraded />),
				(<Message_OutOfPages />)
			];

			_.each(checks, function(check) {
				var message = React.renderToStaticMarkup(check);
				$(messages).find('.column').append( $(message) );
			});
		},

		render: function() {
			return (
				<Row className="messages">
					<Column width="12">
					</Column>
				</Row>
			);
		}
	});
});