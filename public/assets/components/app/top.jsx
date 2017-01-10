define([
	'react',
	'underscore',
	'backbone',
	'jsx!components/app/top',
	'jsx!components/app/notifications',
	'jsx!components/app/account_dropdown',
	'jsx!components/common/guard'
], function(
	React,
	_,
	Backbone,
	Top,
	Notifications,
	Account_DropDown,
	Guard
) {
	return React.createClass({
		render: function() {
			var route = Backbone.history.fragment;

			var accountDropdown = null,
				notifications = null;

			if (_.isString(route) && route != 'login') {
				accountDropdown = (
					<Guard login={true}>
						<ul className="desktop">
							<Account_DropDown />
						</ul>
						<ul className="mobile">
							<Account_DropDown mobile={true} />
						</ul>
					</Guard>
				);

				notifications = (
					<Guard login={true}>
						<ul className="desktop">
							<Notifications />
						</ul>
						<ul className="mobile">
							<Notifications mobile={true} />
						</ul>
					</Guard>
				);
			}

			// PROTIP: topbar-right items are in reverse order of what they'll display from left to right

			return (
				<div id="top">
					<nav>
						<div className="topbar-left">
							<a href="/#sites">
								<img src="/assets/img/raven-white.svg" />
								<span className="divider"></span>
								Site Auditor
							</a>
						</div>
						<div className="topbar-right">
							{accountDropdown}
						</div>
						<div className="topbar-right">
							{notifications}
						</div>
					</nav>
				</div>
			);
		}
	});
});
