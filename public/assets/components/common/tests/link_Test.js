define([
	'react',
	'jquery',
	'jsx!components/common/link'
], function(
	React,
	$,
	Link
) {
	describe('Testing common Link -> ', function() {
		var component = React.createElement(Link, {
			options: {
				id: 'link-test',
				target: '_blank',
				label: 'Click Me!',
				url: '#link-test'
			}
		});

		React.render(component, document.getElementById('test_container'));

		var element = $('#test_container').children(0);

		it('has the right id', function() {
			expect($(element).attr('id')).toBe('link-test');
		});

		it('has the right label', function() {
			expect($(element).text().trim()).toBe('Click Me!');
		});

		it('has the right target', function() {
			expect($(element).attr('href')).toBe('#link-test');
		});
	});
});