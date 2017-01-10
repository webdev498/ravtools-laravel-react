define([
	'js/page',
	'js/routes/admin/accounts'
], function (Page) {
	var Routes = {};

	Routes['accounts'] = {
		'index': function() {
			Page.load('jsx!components/admin/sections/accounts/index/page');
		},

		'account/:account_id': function(account_id) {
			Page.load('jsx!components/admin/sections/accounts/account/page', {
				'account_id': account_id
			});
		}
	};

	return Routes;
});
	