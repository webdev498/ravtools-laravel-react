define([
	'request',
	'js/page',
	'js/routes/share'
], function (Request, Page) {
	var Routes = {};

	Routes['s'] = {
		':hash': function(hash) {
			Page.load('jsx!components/sections/share/index/page', {
				'hash': hash
			});
		}
	};

	return Routes;
});
	