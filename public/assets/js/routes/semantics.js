define([
	'js/page',
	'js/routes/semantics'
], function (Page) {
	var Routes = {};

	Routes['semantics'] = {
		'missing_headers/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/semantics/missing_headers/page', {
				'site_id': site_id
			});
		},
		'missing_schema_microdata/:site_id': function(site_id) {
			Page.load('jsx!components/sections/details/semantics/missing_schema_microdata/page', {
				'site_id': site_id
			});
		}
	};

	return Routes;
});