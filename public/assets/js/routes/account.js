define([
	'js/page',
	'js/routes/account'
], function(Page) {
	var Routes = {};

	Routes['account'] = {
		'index': function() {
			Page.load('jsx!components/sections/account/index/page');
		}
	};

	return Routes;
});