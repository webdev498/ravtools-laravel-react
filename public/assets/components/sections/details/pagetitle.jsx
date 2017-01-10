define([
	'react',
	'underscore',
	'request',
	'event',
	'auth',
	'jsx!components/sections/details/pagetitle',
	'jsx!components/common/pagetitle',
	'jsx!components/common/breadcrumb',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/messages'
], function(
	React,
	_,
	Request,
	Event,
	Auth,
	Details_PageTitle,
	PageTitle,
	Breadcrumb,
	Row,
	Column,
	Messages
) {
	return React.createClass({
		getInitialState: function() {
			return {
				url: null
			}
		},

		componentWillMount: function() {
			var self = this;

			Request.get('/auditor/sites/site', {
				data: {
					'site_id': this.props.site_id
				},
				onSuccess: function(data) {
					self.setState({
						url: data.url
					});
				}
			});
		},

		render: function() {
			var url = (<h4><strong>&nbsp;</strong></h4>);
			if (!_.isNull(this.state.url)) {
				url = (<h4><strong>{this.state.url}</strong></h4>);
			}

			var breadcrumb = {
				label: 'Back to Report',
				url: '#summary/' + this.props.site_id
			};
			if (this.props.hasOwnProperty('breadcrumb') && _.isObject(this.props.breadcrumb)) {
				breadcrumb = this.props.breadcrumb;
			}

			return (
				<div id="details-pagetitle">
					<Breadcrumb label={breadcrumb.label} url={breadcrumb.url} />
					<PageTitle>
						<Row>
							<Column width="12">
								{url}
							</Column>
						</Row>
					</PageTitle>
					<Messages />
				</div>
			);
		}
	});
});
