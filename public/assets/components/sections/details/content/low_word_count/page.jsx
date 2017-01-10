define([
	'react',
	'jsx!components/sections/details/content/low_word_count/page',
	'jsx!components/sections/details/content/low_word_count/table',
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
				'section': 'content',
				'code': 'low_word_count'
			};

			var table = (<Table site_id={this.props.site_id} />);

			return (
				<Page site_id={this.props.site_id} stat={stat} table={table} />
			);
		}
	});
});
