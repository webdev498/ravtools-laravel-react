define([
	'react',
	'underscore',
	'event',
	'auth',
	'jsx!components/sections/sites/index/pagetitle',
	'jsx!components/sections/sites/index/form_analyze',
	'jsx!components/common/pagetitle',
	'jsx!components/common/messages',
	'jsx!components/common/column',
	'jsx!components/common/row'
], function(
	React,
	_,
	Event,
	Auth,
	Sites_PageTitle,
	Form_Analyze,
	PageTitle,
	Messages,
	Column,
	Row
) {
	return React.createClass({
		canAnalyzeSite: function() {
			var plan = Auth.getServicePlan();

			if ( _.isObject(plan) && (this.props.hasOwnProperty('sites') && _.isArray(this.props.sites)) ) {
				var site_count = this.props.sites.length;

				if (!_.isString(plan.name)) {
					return true;
				}

				var plan_name = plan.name.toLowerCase();

				// Raven Accounts should have unlimited sites
				if (plan.billing_pages_remaining == 'Unlimited') {
					return true;
				}

				// Free and Grow Accounts have a Site Limit
				else if (plan_name == 'free' || plan_name == 'grow') {
					return site_count == 0;
				}

				// Pro Accounts have an unlimited Site Limit (always true)
				else
				{
					return true;
				}
			}
			else {
				return true;
			}
		},

		render: function() {
			var enableAnalyze = this.canAnalyzeSite();

			return (
				<div id="sites-pagetitle">
					<PageTitle>
						<Row>
							<Column width="7">
								<h1>Your Sites</h1>
							</Column>
							<Column width="5">
								<Row>
									<Form_Analyze enableAnalyze={enableAnalyze} />
								</Row>
							</Column>
						</Row>
					</PageTitle>
					<Messages />
				</div>
			);
		}
	});
});
