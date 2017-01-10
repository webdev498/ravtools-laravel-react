define([
	'react',
	'event',
	'underscore',
	'request',
	'jsx!components/sections/summary/index/page',
	'jsx!components/sections/summary/index/pagetitle',
	'jsx!components/sections/summary/index/summary_overall',
	'jsx!components/sections/summary/index/summary_issues',
	'jsx!components/sections/summary/index/summary_analyze',
	'jsx!components/sections/summary/index/summary_share',
	'jsx!components/sections/summary/index/modal_analyze',
	'jsx!components/sections/summary/index/modal_settings',
	'jsx!components/app/modal_share',
	'jsx!components/app/modal_payment',
	'jsx!components/layouts/page',
	'jsx!components/common/column',
	'jsx!components/common/row',
	'jsx!components/common/loading'
], function(
	React,
	Event,
	_,
	Request,
	Page,
	PageTitle,
	Summary_Overall,
	Summary_Issues,
	Summary_Analyze,
	Summary_Share,
	Modal_Analyze,
	Modal_Settings,
	Modal_Share,
	Modal_Payment,
	Layout,
	Column,
	Row,
	Loading
) {
	return React.createClass({
		is_requesting: false,

		getInitialState: function() {
			return {
				site_id: null,
				summary: null
			}
		},

		componentWillMount: function() {
			var self = this;

			self.getSummary({
				'site_id': self.props.site_id
			});

			Event.add('summary.refresh', self.getSummary);
		},

		componentWillUpdate: function (next_props) {
			var self = this;

			self.getSummary({
				'site_id': next_props.site_id
			});
		},

		componentWillUnmount: function() {
			Event.remove('summary.refresh', this.getSummary);
		},

		getSummary: function(options) {
			var self = this;

			if (options.site_id == self.state.site_id || this.is_requesting) {
				return false;
			}

			var site_id = options.site_id || self.state.site_id || null;
			if (_.isNull(site_id)) {
				return false;
			}

			this.is_requesting = true;

			Request.get('/auditor/sites/site/summary', {
				data: {
					site_id: site_id
				},
				onSuccess: function(response) {
					self.setState({
						summary: response.data,
						site_id: site_id
					});

					Event.fire('summary.refresh.success');

					self.is_requesting = false;
				},
				onError: function (response) {
					self.is_requesting = false;
				}
			});
		},

		render: function() {
			var self = this;
			var summary = self.state.summary;

			var header = (
				<PageTitle summary={summary} />
			);

			var modals = [
				(<Modal_Analyze site_id={self.props.site_id} summary={summary} />),
				(<Modal_Settings site_id={self.props.site_id} />),
				(<Modal_Share site_id={self.props.site_id} />),

				(<Modal_Payment />)
			];

			var content = (
				<Column>
					<Loading />
				</Column>
			);
			if (_.isObject(summary)) {
				content = (
					<Column>
						<Summary_Overall summary={summary} />

						<Summary_Issues summary={summary} />

						<Summary_Analyze summary={summary} />

						<Summary_Share summary={summary} />
					</Column>
				);
			}

			return (
				<Layout id="summary-page" type="single" header={header} modals={modals}>
					{content}
				</Layout>
			);
		}
	});
});
