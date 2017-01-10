define([
	'js/page',
	'js/routes/summary'
], function (Page) {
	var Routes = {};

	Routes['summary'] = {
		'(index/):site_id': function(site_id) {
			Page.load('jsx!components/sections/summary/index/page', {
				'site_id': site_id
			});
		}
	};

	return Routes;
});
	