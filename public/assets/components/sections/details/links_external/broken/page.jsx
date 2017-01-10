define([
	'react',
	'jsx!components/sections/details/links_external/broken/page',
	'jsx!components/sections/details/links_external/broken/table',
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
				'section': 'links_external',
				'code': 'broken'
			};

			var table = (<Table site_id={this.props.site_id} />);

			return (
				<Page site_id={this.props.site_id} stat={stat} table={table} />
			);
		}
	});
});