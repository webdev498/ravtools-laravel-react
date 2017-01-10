define([
	'react',
	'jsx!components/sections/details/semantics/missing_headers/page',
	'jsx!components/sections/details/semantics/missing_headers/table',
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
				'section': 'semantics',
				'code': 'missing_headers'
			};

			var table = (<Table site_id={this.props.site_id} />);

			return (
				<Page site_id={this.props.site_id} stat={stat} table={table} />
			);
		}
	});
});
