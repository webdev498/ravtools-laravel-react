define([
	'js/page',
	'js/routes/links_external'
], function (Page) {
	var Routes = {};

	Routes['links_external'] = {
		'broken/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/links_external/broken/page', {
				'site_id': site_id
			});
		},

		'broken/:site_id/:url_hash': function(site_id, url_hash) {
			Page.load('jsx!components/sections/details/links_external/broken/pages/page', {
				'site_id': site_id,
				'url_hash': url_hash
			});
		},

		'missing_anchor_or_alt/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/links_external/missing_anchor_or_alt/page', {
				'site_id': site_id
			});
		},

		'missing_anchor_or_alt/:site_id/:url_hash': function(site_id, url_hash) {
			Page.load('jsx!components/sections/details/links_external/missing_anchor_or_alt/pages/page', {
				'site_id': site_id,
				'url_hash': url_hash
			});
		},

		'nofollow/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/links_external/nofollow/page', {
				'site_id': site_id
			});
		},

		'nofollow/:site_id/:url_hash': function(site_id, url_hash) {
			Page.load('jsx!components/sections/details/links_external/nofollow/pages/page', {
				'site_id': site_id,
				'url_hash': url_hash
			});
		}
	};

	return Routes;
});
	