define([
	'js/page',
	'js/routes/admin/sites'
], function (Page) {
	var Routes = {};

	Routes['sites'] = {
		'index': function() {
			Page.load('jsx!components/admin/sections/sites/index/page');
		},

		'site/:site_id': function(site_id) {
			Page.load('jsx!components/admin/sections/sites/site/page', {
				'site_id': site_id
			});
		}
	};

	return Routes;
});