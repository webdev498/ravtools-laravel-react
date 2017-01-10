define([
	'react',
	'underscore',
	'backbone',
	'jsx!components/admin/app/top',
	'jsx!components/app/account_dropdown'
], function(
	React,
	_,
	Backbone,
	Top,
	Account_DropDown
) {
	return React.createClass({
		render: function() {
			var route = Backbone.history.fragment;

			var accountDropdown, adminNavigation = null;

			if (_.isString(route) && route != 'login') {
				adminNavigation = (
					<span id="admin_navigation">
						<a href="#accounts">Accounts</a>
						<a href="#sites">Sites</a>
						<a href="#crawls">Crawls</a>
						<a href="#packages">Packages/Features</a>
						<a href="#shares">Shares</a>
					</span>
				);

				accountDropdown = (
					<span id="account_dropdown">
						<ul className="desktop">
							<Account_DropDown admin={true} />
						</ul>
						<ul className="mobile">
							<Account_DropDown admin={true} mobile={true} />
						</ul>
					</span>
				);
			}

			// PROTIP: topbar-right items are in reverse order of what they'll display from left to right

			return (
				<div id="top">
					<nav>
						<div className="topbar-left">
							<a href="#accounts">
								<img src="/assets/img/raven-white.svg" />
								<span className="divider"></span>
								Site Auditor <strong>[Admin]</strong>
							</a>
							{adminNavigation}
						</div>

						<div className="topbar-right">
							{accountDropdown}
						</div>
					</nav>
				</div>
			);
		}
	});
});
