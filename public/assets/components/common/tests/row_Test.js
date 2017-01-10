define([
	'react',
	'jquery',
	'jsx!components/common/row'
], function(
	React,
	$,
	Row
) {
	describe('Testing common Row -> ', function() {
		var content = React.createElement('div', {
			className: 'content'
		}, 'content');

		var component = React.createElement(Row, {
			id: 'test-row',
			className: 'test-row'
		}, content);

		React.render(component, document.getElementById('test_container'));

		var element = $('#test_container').children(0);

		it('has the correct id', function() {
			expect($(element).attr('id')).toBe('test-row');
		});

		it('has the correct class', function() {
			expect($(element).hasClass('test-row')).toBeTruthy();
		});

		it('has the correct content', function() {
			expect($(element).find('.content').first().text().trim()).toBe('content');
		});
	});
});