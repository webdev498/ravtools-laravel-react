define([
	'react',
	'jsx!components/sections/details/visibility/blocked_by_robots/page',
	'jsx!components/sections/details/visibility/blocked_by_robots/table',
	'jsx!components/sections/details/page'
], function(
	React,
	Details_Page,
	Table,
	Page
) {
	return React.createClass({
		render: function() {
			var stat = {
				'section': 'visibility',
				'code': 'blocked_by_robots'
			};

			var table = (<Table site_id={this.props.site_id} />);

			return (
				<Page site_id={this.props.site_id} stat={stat} table={table} />
			);
		}
	});
});
