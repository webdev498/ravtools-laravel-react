define([
	'js/page',
	'js/routes/meta'
], function (Page) {
	var Routes = {};

	Routes['meta'] = {
		'missing_title/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/meta/missing_title/page', {
				'site_id': site_id
			});
		},

		'invalid_title/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/meta/invalid_title/page', {
				'site_id': site_id
			});
		},

		'duplicate_title/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/meta/duplicate_title/page', {
				'site_id': site_id
			});
		},

		'duplicate_title/:site_id/:page_id': function(site_id, page_id) {
			Page.load('jsx!components/sections/details/meta/duplicate_title/pages/page', {
				'site_id': site_id,
				'page_id': page_id
			});
		},

		'missing_description/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/meta/missing_description/page', {
				'site_id': site_id
			});
		},

		'invalid_description/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/meta/invalid_description/page', {
				'site_id': site_id
			});
		},

		'duplicate_description/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/meta/duplicate_description/page', {
				'site_id': site_id
			});
		},

		'duplicate_description/:site_id/:page_id': function(site_id, page_id) {
			Page.load('jsx!components/sections/details/meta/duplicate_description/pages/page', {
				'site_id': site_id,
				'page_id': page_id
			});
		},

		'missing_google_analytics/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/meta/missing_google_analytics/page', {
				'site_id': site_id
			});
		}
	};

	return Routes;
});
	