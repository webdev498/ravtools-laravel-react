define([
	'react',
	'jsx!components/sections/details/links_internal/nofollow/page',
	'jsx!components/sections/details/links_internal/nofollow/table',
	'jsx!components/sections/details/page'
], function(
	React,
	Details_Page,
	Table,
	Page
) {
	return React.createClass({
		render: function () {
			var stat = {
				'section': 'links_internal',
				'code': 'nofollow'
			};

			var table = (<Table site_id={this.props.site_id} />);

			return (
				<Page site_id={this.props.site_id} stat={stat} table={table} />
			);
		}
	});
});