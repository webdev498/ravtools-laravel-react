define([
	'react',
	'jquery',
	'jsx!components/common/icon'
], function(
	React,
	$,
	Icon
) {
	describe('Testing common Icon -> ', function() {
		var component = React.createElement(Icon, {
			library: 'test-library',
			icon: 'test-icon'
		});

		React.render(component, document.getElementById('test_container'));

		var element = $('#test_container').children(0);

		it('is an icon', function() {
			expect($(element).hasClass('icon')).toBe(true);
		});

		it('has the right library', function() {
			expect($(element).hasClass('test-library')).toBe(true);
		});

		it('has the right icon', function() {
			expect($(element).hasClass('test-icon')).toBe(true);
		});
	});
});