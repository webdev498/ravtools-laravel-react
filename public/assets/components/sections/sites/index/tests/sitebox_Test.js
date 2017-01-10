define([
	'react',
	'jquery',
	'jsx!components/sections/sites/index/sitebox'
], function(
	React,
	$,
	SiteBox
) {
	describe('Testing sections/sites/index SiteBox -> ', function() {
		var component = React.createElement(SiteBox, {
			site: {
				label: 'test-site',
				status: 'a',
				url: 'http://test-site.local',
				total: {
					pages: '100',
					issues: '100'
				},
				prev: {
					change: '100'
				},
				update_ts: '2016-02-17 12:00:00'
			}
		});

		React.render(component, document.getElementById('test_container'));

		var element = $('#test_container').children(0);

		it('has the correct label', function() {
			expect($(element).find('.site-box-label').first().text().trim()).toBe('test-site');
		});

		it('has an Actions DropDown', function() {
			expect($(element).find('.site-box-cog .dropdown-toggle').length).toBe(1);
		});

		it('has the correct status', function() {
			expect($(element).find('.site-box-status').first().text().trim()).toBe('a');
		});

		it('has the correct message', function() {
			expect($(element).find('.site-box-message').first().text().trim()).toBe('Updated February 17, 2016');
		});

		it('has the correct Stat 1', function() {
			expect($(element).find('.site-box-stat-1').first().text().trim()).toBe('100 Issues');
		});

		it('has the correct Stat 2', function() {
			expect($(element).find('.site-box-stat-2').first().text().trim()).toBe('100%');
		});
	});
});