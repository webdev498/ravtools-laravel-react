define([
	'react',
	'jquery',
	'jsx!components/common/column'
], function(
	React,
	$,
	Column
) {
	describe('Testing common Column -> ', function() {
		var content = React.createElement('div', {
			className: 'content'
		}, 'testing');

		var component = React.createElement(Column, {
			id: 'test-column',
			width: '6'
		}, content);

		React.render(component, document.getElementById('test_container'));

		var element = $('#test_container').children(0);

		it('has the correct id', function() {
			expect($(element).attr('id')).toBe('test-column');
		});

		it('has the correct width', function() {
			expect($(element).hasClass('col-md-6')).toBe(true);
		});

		it('has the correct content', function() {
			expect($(element).find('.content').text()).toBe('testing');
		});
	});
});