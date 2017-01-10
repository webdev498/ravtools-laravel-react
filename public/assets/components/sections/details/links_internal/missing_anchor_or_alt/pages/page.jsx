define([
	'react',
	'jsx!components/sections/details/links_internal/missing_anchor_or_alt/pages/page',
	'jsx!components/sections/details/links_internal/missing_anchor_or_alt/pages/table',
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
				'section': 'links_internal',
				'code': 'missing_anchor_or_alt'
			};

			var table = (<Table site_id={this.props.site_id} url_hash={this.props.url_hash} />);

			var breadcrumb = {
				url: '#links_internal/missing_anchor_or_alt/' + this.props.site_id,
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