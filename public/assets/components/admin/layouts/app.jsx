define([
	'react',
	'auth',
	'event',
	'jsx!components/admin/layouts/app',
	'jsx!components/admin/app/top',
	'jsx!components/app/bottom',
	'jsx!components/common/alerts'
], function(
	React,
	Auth,
	Event,
	Layout,
	Top,
	Bottom,
	Alerts
) {
	return React.createClass({
		getInitialState: function() {
			return {
				page: null
			}
		},

		componentWillMount: function() {
			Event.add('app.router.updated', this.handleUpdate);
			Event.add('app.login.expired', this.handleSessionExpired);

			Auth.checkLogin();
		},

		componentWillUnmount: function() {
			Event.remove('app.router.updated', this.handleUpdate);
			Event.remove('app.login.expired', this.handleSessionExpired);
		},

		handleUpdate: function(event) {
			this.setState({
				page: event.detail.page
			});
		},

		handleSessionExpired: function () {			
			Event.fire('app.alert.show', {
				tag: 'login.expired',
				type: 'danger',
				persist: false,
				message: (
					<p>
						<strong>Session Expired</strong>
						You have been logged out.
					</p>
				)
			});
		},

		render: function() {
			var page = this.state.page;

			return (
				<div id="app" className="layout-admin">
					<Alerts />

					<Top />

					{page}

					<Bottom />
				</div>
			);
		}
	})
});
