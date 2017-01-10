define([
	'react',
	'jquery',
	'jsx!components/common/label'
], function(
	React,
	$,
	Label
) {
	describe('Testing common Label -> ', function() {
		var component = React.createElement(Label, {
			name: 'test-input',
			text: 'label',
			required: true
		});

		React.render(component, document.getElementById('test_container'));

		var element = $('#test_container').children(0);

		it('has the right target', function() {
			expect($(element).attr('for')).toBe('test-input');
		});

		it('has the right label', function() {
			expect($(element).text().indexOf('label')).toBeGreaterThan(-1);
		});

		it('is required', function() {
			expect($(element).find('.label-danger').length).toBe(1);
		});
	});
});