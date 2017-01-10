define([
	'react',
	'jquery',
	'jsx!components/common/button'
], function (
	React,
	$,
	Button
) {
	describe('Testing common Button -> ', function () {
		// create the element with the right properties
		var component = React.createElement(Button, {
			'options': {
				'label': 'Click me!',
				'buttonClass': 'foobar'
			}
		});

		// render it to the document
		React.render(component, document.getElementById('test_container'));

		// get it from the DOM for comparison
		var element = $('#test_container').children(0);

		it('has the right label', function () {		
			expect($(element).text().trim()).toBe('Click me!');
		});

		it('has the right class', function () {
			expect($(element).hasClass('foobar')).toBe(true);
		});
	});
});