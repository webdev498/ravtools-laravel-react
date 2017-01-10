define([
	'react',
	'jsx!components/sections/details/links_external/missing_anchor_or_alt/page',
	'jsx!components/sections/details/links_external/missing_anchor_or_alt/table',
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
				'code': 'missing_anchor_or_alt'
			};

			var table = (<Table site_id={this.props.site_id} />);

			return (
				<Page site_id={this.props.site_id} stat={stat} table={table} />
			);
		}
	});
});