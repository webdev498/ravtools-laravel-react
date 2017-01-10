define([
	'react',
	'jquery',
	'jsx!components/common/pagetitle'
], function(
	React,
	$,
	PageTitle
) {
	describe('Testing common PageTitle -> ', function() {
		var component = React.createElement(PageTitle, {
			options: {
				title: 'title',
				subtitle: 'subtitle',
				buttons: [
					{
						buttonClass: 'btn-default',
						label: 'Button 1'
					},
					{
						buttonClass: 'btn-primary',
						label: 'Button 2'
					}
				]
			}
		});

		React.render(component, document.getElementById('test_container'));

		var element = $('#test_container').children(0);

		it('has the right title', function() {
			expect($(element).find('.title span').first().text()).toBe('title');
		});

		it('has the right subtitle', function() {
			expect($(element).find('.title small').first().text()).toBe('subtitle');
		});

		it('has the correct number of buttons', function() {
			expect($(element).find('.btn-toolbar').find('.btn').length).toBe(2);
		});
	});
});