define([
	'js/page',
	'js/routes/links_internal'
], function (Page) {
	var Routes = {};

	Routes['links_internal'] = {
		'broken/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/links_internal/broken/page', {
				'site_id': site_id
			});
		},

		'broken/:site_id/:url_hash': function(site_id, url_hash) {
			Page.load('jsx!components/sections/details/links_internal/broken/pages/page', {
				'site_id': site_id,
				'url_hash': url_hash
			});
		},

		'missing_anchor_or_alt/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/links_internal/missing_anchor_or_alt/page', {
				'site_id': site_id
			});
		},

		'missing_anchor_or_alt/:site_id/:url_hash': function(site_id, url_hash) {
			Page.load('jsx!components/sections/details/links_internal/missing_anchor_or_alt/pages/page', {
				'site_id': site_id,
				'url_hash': url_hash
			});
		},

		'nofollow/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/links_internal/nofollow/page', {
				'site_id': site_id
			});
		},

		'nofollow/:site_id/:url_hash': function(site_id, url_hash) {
			Page.load('jsx!components/sections/details/links_internal/nofollow/pages/page', {
				'site_id': site_id,
				'url_hash': url_hash
			});
		}
	};

	return Routes;
});
	