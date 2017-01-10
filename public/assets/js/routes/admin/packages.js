define([
	'js/page',
	'js/routes/admin/packages'
], function (Page) {
	var Routes = {};

	Routes['packages'] = {
		'index': function() {
			Page.load('jsx!components/admin/sections/packages/index/page');
		},

		'package/:package_id': function(package_id) {
			Page.load('jsx!components/admin/sections/packages/package/page', {
				'package_id': package_id
			});
		},

		'feature/:feature_id': function(feature_id) {
			Page.load('jsx!components/admin/sections/packages/feature/page', {
				'feature_id': feature_id
			});
		}
	};

	return Routes;
});