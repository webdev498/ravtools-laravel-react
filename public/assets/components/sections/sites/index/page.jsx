define([
	'react',
	'underscore',
	'event',
	'request',
	'jsx!components/sections/sites/index/page',
	'jsx!components/sections/sites/index/pagetitle',
	'jsx!components/sections/sites/index/sitegrid',
	'jsx!components/app/modal_upgrade',
	'jsx!components/sections/sites/index/modal_delete',
	'jsx!components/app/modal_payment',
	'jsx!components/layouts/page',
	'jsx!components/common/column',
	'jsx!components/common/guard',
	'jsx!components/common/button'
], function(
	React,
	_,
	Event,
	Request,
	Page,
	PageTitle,
	SiteGrid,
	Modal_Upgrade,
	Modal_Delete,
	Modal_Payment,
	Layout,
	Column,
	Guard,
	Button
) {
	return React.createClass({
		retrieval_attempts: 0,
		retrieval_lock: false,
		retrieval_timeout: null,

		getInitialState: function() {
			return {
				sites: null
			}
		},

		componentWillMount: function() {
			Event.add('sites.refresh', this.getSites);
			Event.add('sites.created', this.addSite);
			Event.add('sites.deleted', this.removeSite);
			Event.add('sites.deleted.success', this.handleSuccess);
			Event.add('sites.created.success', this.handleSuccess);
			Event.add('sites.created.retry', this.handleSuccess);
			Event.add('sites.deleted.success', this.handleSuccess);
				
			Event.fire('sites.refresh');
		},

		componentWillUnmount: function() {
			clearTimeout(this.retrieval_timeout);

			Event.remove('sites.refresh', this.getSites);
			Event.remove('sites.created', this.addSite);
			Event.remove('sites.deleted', this.removeSite);
			Event.remove('sites.delete.success', this.handleSuccess);
			Event.remove('sites.created.success', this.handleSuccess);
			Event.remove('sites.created.retry', this.handleSuccess);
			Event.remove('sites.deleted.success', this.handleSuccess);
		},

		handleSuccess: function() {
			Event.fire('sites.refresh');
		},

		getSites: function() {
			var self = this;

			if (self.retrieval_lock == false) {
				self.retrieval_lock = true;

				Request.get('/auditor/sites', {
					onSuccess: function(data) {
						var previous = self.state.sites;
						var current = data.data;

						if (!_.isEqual(previous, current)) {
							self.setState({
								sites: current
							});
						}

						self.retrieval_attempts += 1;

						if (data.total > 0) {
							// try updating for thirty minutes, then stop
							if (self.retrieval_attempts < 120) {
								clearTimeout(self.retrieval_timeout);

								self.retrieval_timeout = setTimeout(self.getSites, 15000);
							}
							else {
								self.retrieval_attempts = 0;
							}

							Event.fire('notifications.refresh');
						}

						self.retrieval_lock = false;
					},

					onError: function() {
						self.retrieval_lock = false;
					}
				});
			}
		},

		addSite: function (event) {
			var site = {
				site_id: null,
				label: 'Adding New Website',
				status: 'p',
				total: {
					pages: '-',
					issues: '-'
				},
				previous: {
					pages: '-',
					issues: '-',
					change: '-'
				},
				rel: {
					site: null,
					summary: null
				},
				update_ts: null
			};

			site.url = event.detail.url;

			var sites = this.state.sites;

			if (_.isArray(sites)) {
				sites.push(site);

				this.setState({
					'sites': sites
				});
			}
		},

		removeSite: function(event) {
			var sites = this.props.sites;
			var target = event.detail.site_id;

			var removeIndex = _.findIndex(sites, function(site) {
				return site.id == target;
			});

			if (removeIndex >= 0) {
				sites.splice(removeIndex, 1);

				this.setState({
					'sites': sites
				});
			}
		},

		render: function() {
			var sites = this.state.sites;

			$('#app-container').addClass('with-background');

			var header = (<PageTitle sites={sites} />);

			var modals = [
				(<Modal_Upgrade />),
				(<Modal_Delete />)
			];

			return (
				<Layout id="sites-page" type="single" header={header} modals={modals}>
					<Column>
						<SiteGrid sites={sites} />
					</Column>
				</Layout>
			);
		}
	});
});
