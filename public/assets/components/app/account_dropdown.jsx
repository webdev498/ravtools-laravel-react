define([
	'react',
	'underscore',
	'auth',
	'event',
	'jsx!components/app/account_dropdown',
	'jsx!components/common/dropdown',
	'jsx!components/common/icon'
], function(
	React,
	_,
	Auth,
	Event,
	Account_DropDown,
	DropDown,
	Icon
) {
	return React.createClass({
		getInitialState: function() {
			return {
				name: 'Account User',
				picture: null
			}
		},

		componentWillMount: function() {
			var profile = Auth.getProfile();

			this.setState({
				name: profile.name,
				picture: profile.picture
			});
		},

		handleLogout: function() {
			Auth.handleLogout();
		},

		render: function() {
			var self = this;

			var label = null;
			var showCaret = true;

			if (self.props.mobile == true) {
				label = (<Icon icon="glyphicon-menu-hamburger" />);
				showCaret = false;
			}
			else {
				label = (<span className="account-label">{self.state.name}</span>);
				if (_.isString(self.state.picture)) {
					label = (<span className="account-label"><img src={self.state.picture} />{self.state.name}</span>)
				}
			}


			var options = {
				label: label,
				listItem: true,
				showCaret: showCaret,
				alignRight: true
			};

			var links = [];

			if (this.props.hasOwnProperty('admin') && this.props.admin == true) {
				links = links.concat([
					{
						type: 'link',
						label: 'Return to App',
						onClick: function() {
							window.location.href = "/#sites";
						}
					}

				]);
			}
			else {
				links = links.concat([
					{
						type: 'link',
						label: 'My Account',
						onClick: function() {
							Router.navigate('account', {trigger:true});
						}
					},
					{
						type: 'link',
						label: 'Help',
						onClick: function() {
							Event.fire('app.help_modal.show');
						}
					}
				]);
			}

			links = links.concat([
				{
					type: 'link',
					label: 'Logout',
					onClick: function() {
						self.handleLogout();
					}
				}
			]);

			return (
				<DropDown
					className="account-dropdown"
					options={options}
					links={links}
				/>
			);
		}
	});
});