define([
	'js/page',
	'js/routes/admin/crawls'
], function (Page) {
	var Routes = {};

	Routes['crawls'] = {
		'index': function() {
			Page.load('jsx!components/admin/sections/crawls/index/page');
		},

		'crawl/:crawl_id': function(crawl_id) {
			Page.load('jsx!components/admin/sections/crawls/crawl/page', {
				'crawl_id': crawl_id
			});
		}
	};

	return Routes;
});