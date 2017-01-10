define([
	'react',
	'request',
	'event',
	'jsx!components/sections/share/index/page',
	'jsx!components/sections/share/index/pagetitle',
	'jsx!components/layouts/page',
	'jsx!components/common/column',
	'jsx!components/common/loading'
], function(
	React,
	Request,
	Event,
	Page,
	PageTitle,
	Layout,
	Column,
	Loading
) {
	return React.createClass({
		componentDidMount: function() {
			Request.post('/auditor/sites/site/hash', {
				data: {
					'hash': this.props.hash
				},
				onSuccess: function(response) {
					var redirect_url = '';

					if (response.hasOwnProperty('data') && response.data.hasOwnProperty('redirect_url')) {
						redirect_url = response.data.redirect_url;
						window.location = window.location.protocol + '//' + window.location.host + '/' + redirect_url;

						return true;
					}

					return false;
				}
			});
		},

		render: function() {
			var header = (<PageTitle site_id={this.props.site_id} />);

			var modals = [];

			var content = (
				<Column>
					<Loading />
				</Column>
			);

			return (
				<Layout id="share-page" type="single" header={header} modals={modals}>
					{content}
				</Layout>
			);
		}
	});
});