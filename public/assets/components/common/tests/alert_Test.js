define([
	'react',
	'jquery',
	'jsx!components/common/alert'
], function(
	React,
	$,
	Alert
) {
	describe('Testing common Alert -> ', function() {
		var component = React.createElement(Alert, {
			id: 'test-alert',
			type: 'warn',
			spinner: true
		});

		React.render(component, document.getElementById('test_container'));

		var element = $('#test_container').children(0);

		it('has the correct id', function() {
			expect($(element).attr('id')).toBe('test-alert');
		});

		it('has the correct class', function() {
			expect($(element).hasClass('alert-warn')).toBe(true);
		});

		it('has a spinner', function() {
			expect($(element).find('.spinner').length).toBe(1);
		});
	});
});