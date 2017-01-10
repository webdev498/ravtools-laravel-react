define([
	'react',
	'auth',
	'jsx!components/common/guard'
], function(
	React,
	Auth,
	Guard
) {
	return React.createClass({
		getInitialState: function () {
			return {
				'show': false
			};
		},

		componentWillMount: function () {
			var self = this;

			return Raven.api_promise.promise.then(function() {
				self.setState({
					'show': self.checkLogin()
				});
			});
		},

		checkLogin: function() {
			var token = Auth.getToken();

			if (this.props.login === true) {
				if (this.props.trial === true) {
					return this.checkTrial();
				}
				else {
					if (!_.isString(Raven.user_id)) {
						return false;
					}

					return token ? true: false;
				}
			}
			else {
				return true;
			}
		},

		//todo: Check logic for testing Paid vs. Trial
		checkTrial: function() {
			var token = Auth.getToken();
			var profile = Auth.getProfile();

			return true;
		},

		render: function() {
			var show = this.state.show;

			if (show) {
				return (
					<span className="auth-content access">
						{this.props.children}
					</span>
				);
			}
			else {
				return (
					<span className="auth-content no-access"></span>
				);
			}
		}
	});
});