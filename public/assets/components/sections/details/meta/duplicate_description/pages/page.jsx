define([
	'react',
	'jsx!components/sections/details/meta/duplicate_description/pages/page',
	'jsx!components/sections/details/meta/duplicate_description/pages/table',
	'jsx!components/sections/details/page'
], function(
	React,
	Details_Subpage,
	Table,
	Page
) {
	return React.createClass({
		render: function() {
			var stat = {
				'section': 'meta',
				'code': 'duplicate_description'
			};

			var table = (<Table site_id={this.props.site_id} page_id={this.props.page_id} />);

			var breadcrumb = {
				url: '#meta/duplicate_description/' + this.props.site_id,
				label: 'Back to Issue'
			};

			return (
				<Page
					subheading={'Pages'}
					site_id={this.props.site_id}
					page_id={this.props.page_id}
					stat={stat}
					table={table}
					breadcrumb={breadcrumb}
				/>
			);
		}
	});
});