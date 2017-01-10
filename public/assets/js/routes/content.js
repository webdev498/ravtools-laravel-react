define([
	'js/page',
	'js/routes/content'
], function (Page) {
	var Routes = {};

	Routes['content'] = {
		'low_word_count/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/content/low_word_count/page', {
				'site_id': site_id
			});
		},

		'duplicate_content/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/content/duplicate_content/page', {
				'site_id': site_id
			});
		},

		'duplicate_content/:site_id/:page_id': function(site_id, page_id) {
			Page.load('jsx!components/sections/details/content/duplicate_content/pages/page', {
				'site_id': site_id,
				'page_id': page_id
			});
		}
	};

	return Routes;
});
	