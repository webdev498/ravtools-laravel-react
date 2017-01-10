define([
	'js/page',
	'js/routes/images'
], function (Page) {
	var Routes = {};

	Routes['images'] = {
		'broken/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/images/broken/page', {
				'site_id': site_id
			});
		},

		'broken/:site_id/:url_hash': function(site_id, url_hash) {
			Page.load('jsx!components/sections/details/images/broken/pages/page', {
				'site_id': site_id,
				'url_hash': url_hash
			});
		},

		'missing_alt/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/images/missing_alt/page', {
				'site_id': site_id
			});
		},

		'missing_alt/:site_id/:url_hash': function(site_id, url_hash) {
			Page.load('jsx!components/sections/details/images/missing_alt/pages/page', {
				'site_id': site_id,
				'url_hash': url_hash
			});
		},

		'missing_title/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/images/missing_title/page', {
				'site_id': site_id
			});
		},

		'missing_title/:site_id/:url_hash': function(site_id, url_hash) {
			Page.load('jsx!components/sections/details/images/missing_title/pages/page', {
				'site_id': site_id,
				'url_hash': url_hash
			});
		}
	};

	return Routes;
});
	