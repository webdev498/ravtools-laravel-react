define([
	'js/page',
	'js/routes/visibility'
], function (Page) {
	var Routes = {};

	Routes['visibility'] = {
		'errors/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/visibility/errors/page', {
				'site_id': site_id
			});
		},

        'redirects/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/visibility/redirects/page', {
				'site_id': site_id
			});
		},

		'blocked_by_robots/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/visibility/blocked_by_robots/page', {
				'site_id': site_id
			});
		},

		'malware/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/visibility/malware/page', {
				'site_id': site_id
			});
		}
	};

	return Routes;
});
	