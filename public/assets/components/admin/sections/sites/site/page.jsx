define([
	'react',
	'underscore',
	'request',
	'jsx!components/admin/layouts/page',
	'jsx!components/admin/sections/sites/site/page',
	'jsx!components/admin/sections/sites/site/crawls_table',
	'jsx!components/common/loading',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/breadcrumb',
	'jsx!components/common/link',
	'jsx!components/common/panel',
	'jsx!components/common/date'
], function(
	React,
	_,
	Request,
	Layout,
	Page,
	Crawls_Table,
	Loading,
	Row,
	Column,
	Breadcrumb,
	Link,
	Panel,
	Date
) {
	return React.createClass({
		getInitialState: function() {
			return {
				site: null
			}
		},

		componentWillMount: function() {
			this.getSite(this.props.site_id);
		},

		getSite: function(site_id) {
			var self = this;

			Request.get('/admin/sites/site', {
				data: {
					site_id: site_id
				},

				onSuccess: function(data) {
					self.setState({
						site: data
					});
				}
			});
		},

		render: function() {
			var site = this.state.site;
			var date_format = "MMM D, YYYY (HH:mm)";

			if (!_.isObject(site)) {
				return (
					<Layout id="site-page" className="single-page">
						<Breadcrumb />
						<Loading />
					</Layout>
				);
			}

			var account = "No Account";
			if (site.hasOwnProperty('account_name') && _.isString(site.account_name)) {
				account = (
					<Link options={ {
						label: site.account_name,
						url: '#accounts/account/' + site.account_id
					} } />
				);
			}

			var crawlFrequency = 'Not Specified';
			if (site.hasOwnProperty('crawl_interval')) {
				if (site.crawl_interval == 'weekly') {
					crawlFrequency = 'Weekly (Every ' + site.crawl_interval_setting.toUpperCase() + ')';
				}
				else if (site.crawl_interval == 'monthly') {
					crawlFrequency = 'Monthly (On the ' + site.crawl_interval_setting + ')';
				}
				else {
					crawlFrequency = 'Manual';
				}
			}

			var nextCrawl = "Not Scheduled";
			if (site.hasOwnProperty('scheduled_ts') && site.scheduled_ts > 0) {
				nextCrawl = (
					<Date ts={site.scheduled_ts} format={date_format} />
				);
			}

			return (
				<Layout id="site-page" className="single-page">
					<Breadcrumb />
					<Row>
						<Column width="12">
							<h1>{site.url} <small>Site</small></h1>
						</Column>
					</Row>
					<Row>
						<Column width="3">
							<Panel title="General">
								<Row>
									<img src={site.screenshot_thumb} className="center-block" />
								</Row>
								<dl>
									<dt>ID</dt>
									<dd>{site.id}</dd>

									<dt>URL</dt>
									<dd>
										<Link options={ {
											label: site.url,
											icon: 'glyphicon glyphicon-share',
											url: site.url,
											updateHash: false,
											target: '_blank'
										} } />
									</dd>

									<dt>Account</dt>
									<dd>
										{account}
									</dd>

									<dt>Last Crawl</dt>
									<dd>
										<Link options={ {
											label: (<Date ts={site.complete_ts} format={date_format} />),
											url: '#crawls/crawl/' + site.last_completed_session
										} } />
									</dd>


									<dt>Created</dt>
									<dd>
										<Date ts={site.created_ts} format={date_format} />
									</dd>
								</dl>
							</Panel>

							<Panel title="Schedule">
								<dl>
									<dt>Frequency</dt>
									<dd>
										{crawlFrequency}
									</dd>
								</dl>
								<dl>
									<dt>Next Crawl</dt>
									<dd>
										{nextCrawl}
									</dd>
								</dl>
							</Panel>
						</Column>
						<Column width="9">
							<section>
								<h3>Crawls</h3>
								<Crawls_Table site_id={this.props.site_id} />
							</section>
						</Column>
					</Row>
				</Layout>
			);
		}
	});
});