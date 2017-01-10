define([
	'react',
	'jquery',
	'jsx!components/common/dropdown'
], function(
	React,
	$,
	DropDown
) {
	describe('Testing common DropDown -> ', function() {
		var component = React.createElement(DropDown, {
			id: 'dropdown-test',
			options: {
				icon: 'dropdown-icon',
				label: 'Click Me!'
			},
			links: [
				{
					type: 'link',
					label: 'Option 1',
					url: '#option-1'
				},
				{
					type: 'link',
					label: 'Option 2',
					url: '#option-2'
				}
			]
		});

		React.render(component, document.getElementById('test_container'));

		var element = $('#test_container').children(0);

		it('has the right id', function() {
			expect($(element).attr('id')).toBe('dropdown-test');
		});

		it('has a single dropdown-menu child', function() {
			expect($(element).children('ul.dropdown-menu').length).toBe(1);
		});

		it('has two menu items', function() {
			expect($(element).children('ul.dropdown-menu').children('li').length).toBe(2);
		});
	});
});