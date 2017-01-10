define([
	'react',
	'auth',
	'request',
	'event',
	'jsx!components/app/account_dropdown',
	'jsx!components/app/notificationitem',
	'jsx!components/common/dropdown',
	'jsx!components/common/icon'
], function(
	React,
	Auth,
	Request,
	Event,
	Account_DropDown,
	NotificationItem,
	DropDown,
	Icon
) {
	return React.createClass({
		getInitialState: function() {
			return {
				notifications: null,
				unread_count: null
			}
		},

		componentWillMount: function() {
			this.getNotifications();

			Event.add('notifications.refresh', this.getNotifications);
		},

		componentWillUnmount: function() {
			Event.remove('notifications.refresh', this.getNotifications);
		},

		getNotifications: function () {
			var self = this;

			Request.get('/notifications', {
				onSuccess: function(data) {
					if (_.isArray(data.data)) {
						self.setState({
							'notifications': data.data,
							'unread_count': data.unread_count
						});
					}					
				}
			});
		},

		readAllNotifications: function () {
			var self = this;

			Request.post('/notifications/read_all', {
				onSuccess: function(data) {
					if (_.isArray(data.data)) {
						self.setState({
							'notifications': data.data,
							'unread_count': data.unread_count
						});
					}					
				}
			});
		},

		render: function() {
			var self = this;

			var label = null;
			var showCaret = true;
			var count = '';

			if (!_.isNull(self.state.unread_count)) {
				count = ' (' + self.state.unread_count + ')';
			}

			if (self.props.mobile == true) {
				label = (<Icon icon="glyphicon-bell" />);
				showCaret = false;
			}
			else {
				label = (<span className="notification-label"><Icon icon="glyphicon-bell" /> Notifications{count}</span>);
			}

			var options = {
				label: label,
				listItem: true,
				showCaret: showCaret,
				alignRight: true,

				onClose: function () {
					self.readAllNotifications();
				}
			};

			var links = [];
	
			_.each(self.state.notifications, function (notification) {
				links.push({
					type: 'object',
					html: (<NotificationItem options={notification} />)
				});	
			});	

			if (links.length == 0) {	
				links.push({
					type: 'header',
					label: 'No unread notifications.'
				});
			}
			
			return (
				<DropDown
					className="notification-dropdown"
					options={options}
					links={links}
				/>
			);
		}
	});
});
