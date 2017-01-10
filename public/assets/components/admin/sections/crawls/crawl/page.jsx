define([
	'react',
	'underscore',
	'request',
	'jsx!components/admin/layouts/page',
	'jsx!components/admin/sections/crawls/crawl/page',
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
				crawl: null
			}
		},

		componentWillMount: function() {
			this.getCrawl(this.props.crawl_id);
		},

		getCrawl: function(crawl_id) {
			var self = this;

			Request.get('/admin/crawls/crawl', {
				data: {
					crawl_id: crawl_id
				},

				onSuccess: function(data) {
					self.setState({
						crawl: data
					})
				}
			});
		},

		render: function() {
			var crawl = this.state.crawl;
			var date_format = "MMM D, YYYY (HH:mm)";

			if (!_.isObject(crawl)) {
				return (
					<Layout id="crawl-page" className="single-page">
						<Breadcrumb />
						<Loading />
					</Layout>
				);
			}

			return (
				<Layout id="crawl-page" className="single-page">
					<Breadcrumb />
					<Row>
						<Column width="12">
							<h1><Date ts={crawl.complete_ts} format={date_format} /> <small>Crawl</small></h1>
						</Column>
					</Row>
					<Row>
						<Column width="3">
							<Panel title="General">
								<dl>
									<dt>ID</dt>
									<dd>{crawl.id}</dd>

									<dt>Crawl Session</dt>
									<dd>
										<Date ts={crawl.complete_ts} format={date_format} />
									</dd>

									<dt>Site</dt>
									<dd>
										<Link options={ {
											label: crawl.site_url,
											url: '#sites/site/' + crawl.site_id
										} } />
									</dd>

									<dt>Account</dt>
									<dd>
										<Link options={ {
											label: crawl.account_name,
											url: '#accounts/account/' + crawl.account_id
										} } />
									</dd>

									<dt>Pages Crawled</dt>
									<dd>
										{crawl.pages_crawled}
									</dd>

									<dt>Total Issues</dt>
									<dd>
										{crawl.total_issues}
									</dd>

									<dt>Score</dt>
									<dd>
										{crawl.score}
									</dd>
								</dl>
							</Panel>
						</Column>
						<Column width="9">
						</Column>
					</Row>
				</Layout>
			);
		}
	});
});