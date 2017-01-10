define([
	'react',
	'jsx!components/sections/details/semantics/missing_schema_microdata/page',
	'jsx!components/sections/details/semantics/missing_schema_microdata/table',
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
				'code': 'missing_schema_microdata'
			};

			var table = (<Table site_id={this.props.site_id} />);

			return (
				<Page site_id={this.props.site_id} stat={stat} table={table} />
			);
		}
	});
});
