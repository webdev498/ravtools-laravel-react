define([
	'js/page',
	'js/routes/login'
], function (Page) {
	var Routes = {};

	Routes['login'] = {
		'index': function() {
			Page.load('jsx!components/sections/login/index/page');
		}
	};

	return Routes;
});
	