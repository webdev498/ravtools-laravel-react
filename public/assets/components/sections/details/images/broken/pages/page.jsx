define([
	'react',
	'jsx!components/sections/details/images/broken/pages/page',
	'jsx!components/sections/details/images/broken/pages/table',
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
				'code': 'broken'
			};

			var table = (<Table site_id={this.props.site_id} url_hash={this.props.url_hash} />);

			var breadcrumb = {
				url: '#images/broken/' + this.props.site_id,
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