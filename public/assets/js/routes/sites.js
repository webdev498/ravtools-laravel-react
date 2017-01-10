define([
	'js/page',
	'js/routes/sites'
], function (Page) {
	var Routes = {};

	Routes['sites'] = {
		'index': function() {
			Page.load('jsx!components/sections/sites/index/page');
		}
	};

	return Routes;
});