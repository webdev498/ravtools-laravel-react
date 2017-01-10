define([
	'react',
	'event',
	'jsx!components/common/icon',
	'jsx!components/common/link',
	'jsx!components/app/notificationitem'
], function(
	React,
	Event,
	Icon,
	Link,
	NotificationItem
) {
	return React.createClass({
		render: function() {
			var options = this.props.options,
				message = options.message,
				icon = <div className="notification-item-icon"></div>;

			if (options.read == 0) { // if it's unread, make it blue by wrapping in an anchor
				icon = (
					<div className="notification-item-icon unread"></div>
				);
			}

			if (_.isString(options.url)) {
				var url = options.url,
					message_parts = message.split(options.url),
					message_front = message_parts[0],
					message_back = message_parts[1];

				message = (
					<span className="notification-message">	
						{message_front}<strong>{url}</strong>{message_back}
					</span>
				);
			}
			else {
				message = (
					<span className="notification-message">{message}</span>
				);
			}
			
			if (_.isString(options.site_id)) {
				var link_options = {
					'url' : '/#summary/' + options.site_id
				};

				message = (
					<Link options={link_options}>
						{message}
					</Link>
				);
			}

			return (
				<div className="notification-item">
					{icon}
					{message}
				</div>
			);
		}
	});
});