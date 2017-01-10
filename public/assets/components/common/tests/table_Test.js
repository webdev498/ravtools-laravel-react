define([
	'react',
	'jquery',
	'jsx!components/common/table'
], function(
	React,
	$,
	Table
) {
	describe('Testing common Table -> ', function() {
		var component = React.createElement(Table, {
			endpoint: '/auditor/pages?site_id=1&type=errors',
			columns: [
				{
					data: 'page',
					title: 'Page'
				},
				{
					data: 'redirects_to',
					title: 'Redirects To'
				},
				{
					data: 'blocked_by_robots',
					title: 'Blocked by Robots'
				},
				{
					data: 'blocked_by_noindex',
					title: 'Blocked by NoIndex'
				},
				{
					data: 'status',
					title: 'Status'
				},
				{
					data: 'pages',
					title: 'Pages'
				},
				{
					data: 'redirects',
					title: 'Redirects'
				}
			]
		});

		React.render(component, document.getElementById('test_container'));

		var element = $('#test_container').children(0);

		it('has the correct container', function() {
			expect($(element).find('div.dataTables_wrapper').length).toBe(1);
		});
	});
});