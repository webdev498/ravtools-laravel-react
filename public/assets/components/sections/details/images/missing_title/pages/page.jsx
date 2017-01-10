define([
	'react',
	'jsx!components/sections/details/images/missing_title/pages/page',
	'jsx!components/sections/details/images/missing_title/pages/table',
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
				'section': 'images',
				'code': 'missing_title'
			};

			var table = (<Table site_id={this.props.site_id} url_hash={this.props.url_hash} />);

			var breadcrumb = {
				url: '#images/missing_title/' + this.props.site_id,
				label: 'Back to Issue'
			};

			return (
				<Page
					subheading={'Pages'}
					site_id={this.props.site_id}
					url_hash={this.props.url_hash}
					stat={stat}
					table={table}
					breadcrumb={breadcrumb}
				/>
			);
		}
	});
});