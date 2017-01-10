define([
	'react',
	'jquery',
	'jsx!components/common/modal'
], function(
	React,
	$,
	Modal
) {
	describe('Testing common Modal -> ', function() {
		var content = React.createElement('div', {
			className: 'content'
		}, 'content');

		var component = React.createElement(Modal, {
			id: 'test-modal',
			title: 'title',
			buttons: [
				{
					label: 'Button 1',
					onClick: function() {
						alert('Button 1');
					}
				}
			],
			leftButtons: [
				{
					label: 'Button 2',
					onClick: function() {
						alert('Button 2');
					}
				}
			]
		}, content);

		React.render(component, document.getElementById('test_container'));

		var element = $('#test_container').children(0);

		it('has the correct id', function() {
			expect($(element).attr('id')).toBe('test-modal');
		});

		it('has the correct title', function() {
			expect($(element).find('.modal-title').first().text().trim()).toBe('title');
		});

		it('has the correct content', function() {
			expect($(element).find('.content').first().text().trim()).toBe('content');
		});

		it('has the correct number of buttons', function() {
			expect($(element).find('.btn-toolbar.pull-right .btn').length).toBe(2);
		});

		it('has the correct number of left buttons', function() {
			expect($(element).find('.btn-toolbar.pull-left .btn').length).toBe(1);
		});
	});
});