define([
	'react',
	'jquery',
	'jsx!components/sections/sites/index/sitegrid'
], function(
	React,
	$,
	SiteGrid
) {
	describe('Testing sections/sites/index SiteGrid -> ', function() {
		var sites = [
			{
				'site_id': 1,
				'label': 'Tesla Motors',
				'url': 'http://www.tesla.com',
				'status': 'a',
				'total': {
					'pages': 294,
					'issues': 37
				},
				'prev': {
					'pages': 250,
					'issues': 100,
					'change': ( (37-100) / 100 ) * 100
				},
				'rel': {
					'site': '/api/v1/auditor/sites/site/1', // wut
					'summary': '/api/v1/auditor/sites/site/1/summary' // wut
				},
				'update_ts' : '2015-11-22 12:00:00'
			}
		];

		var component = React.createElement(SiteGrid, { sites: sites });

		React.render(component, document.getElementById('test_container'));

		var element = $('#test_container').children(0);

		it('has the correct container', function() {
			expect($(element).hasClass('site-grid')).toBeTruthy();
		});

		it('has the correct number of SiteBoxes', function() {
			expect($(element).find('.site-box').length).toBe(1);
		});
	});
});
