define([
	'react',
	'moment',
	'event',
	'jsx!components/sections/sites/index/sitebox',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/link',
	'jsx!components/common/dropdown',
	'jsx!components/common/button',
	'jsx!components/common/spinner',
	'jsx!components/common/score'
], function(
	React,
	Moment,
	Event,
	SiteBox,
	Row,
	Column,
	Link,
	DropDown,
	Button,
	Spinner,
	Score
) {
	return React.createClass({
		getInitialState: function() {
			var status = 'complete';

			if (_.isNull(this.props.site.id)) {
				status = 'pending';
			}

			return {
				status: status,
				previous_status: null
			}
		},

		componentWillMount: function () {
			var self = this;

			if (_.isNull(this.props.site.id)) {
				Event.add('sites.created.error', this.markRetry);
			}
			else {
				Event.add('sites.deleted.error.' + this.props.site.id, this.markDeleteRetry);	
			}
		},

		componentWillUnmount: function () {
			if (_.isNull(this.props.site.id)) {
				Event.remove('sites.created.error', this.markRetry);
			}
			else {
				Event.remove('sites.deleted.error.' + this.props.site.id, this.markDeleteRetry);	
			}
		},

		buildBox: function() {
			var self = this,
				site = this.props.site;

			var animate = this.props.hasOwnProperty('animate') ? this.props.animate : true;

			var	box = {
				site_id: site.id,
				label: site.label,
				status: null,
				message: null,

				link_options: {
					label: site.url.replace(/^https?\:\/\//, ''),
					url: '#summary/' + site.id
				},

				gear: []
			};

			if (site.crawls === 0) {
				site.status = 'crawling';
			}

			var screenshot = null;
			if (!_.isEmpty(site.screenshot_thumb) && _.isString(site.screenshot_thumb)) {
				screenshot = (
					<img src={site.screenshot_thumb} />
				);
			}

			box.status = (
				<div className="site-screenshot">
					<Link options={box.link_options}>
						{screenshot}
					</Link>
				</div>
			);

			box.score = (
				<Link options={box.link_options}>
					<Score site={site} fontSize="2.5rem" animate={animate} />
				</Link>
			);

			// Not crawling...
			if (_.isString(site.status) && site.status === 'complete') {
				// Have been crawled once before...
				box.link = (
					<Link options={box.link_options} />
				);

				box.gear = box.gear.concat([
					{
						type: 'link',
						label: 'Delete',
						onClick: this.showDeleteModal
					}
				]);
			}
			// Crawling....
			else {
				// Have been crawled once before...
				if (site.crawls > 1) {
					box.link = (
						<Link options={box.link_options} />
					);

					box.gear = box.gear.concat([
						{
							type: 'link',
							label: 'Delete',
							onClick: this.showDeleteModal
						}
					]);
				}
				// First crawl complete...
				else {
					box.link = (
						<span>{box.link_options.label}</span>
					);

					box.status = (
						<div className="site-crawling">
							<strong>Analyzing...</strong>
							<Spinner size="50" />
						</div>
					);

					box.gear = box.gear.concat([
						{
							type: 'link',
							label: 'Delete',
							onClick: this.showDeleteModal
						}
					]);
				}
			}

			return box;
		},

		markRetry: function() {
			this.setState({
				status: 'retry'
			});
		},

		markDeleteRetry: function() {
			this.setState({
				previous_status: this.state.status,
				status: 'delete_retry'
			});
		},

		getCreateRetryOption: function () {
			var site = this.props.site;

			var options = {
				label: 'Retry',
				buttonClass: 'btn-danger',
				onClick: function() {
					Event.fire('sites.created.retry');

					Event.fire('sites.add_modal.show', {
						'site': site
					});
				}
			};

			return (
				<div className="site-box-blocker">
					<div className="site-box-dialog">
						<p>Whoops, let's try that again.</p>
						<Button options={options} />
					</div>
				</div>
			);
		},

		getDeleteRetryOption: function () {
			var self = this,
				site = this.props.site;

			var options = {
				label: 'Retry',
				buttonClass: 'btn-danger',
				onClick: function() {
					Event.fire('sites.deleted.retry');

					self.showDeleteModal();

					self.setState({
						status: self.state.previous_state,
						previous_state: null
					});
				}
			};

			return (
				<div className="site-box-blocker">
					<div className="site-box-dialog">
						<p>Whoops, let's try deleting <strong>{this.props.site.url}</strong> again.</p>
						<Button options={options} />
					</div>
				</div>
			);
		},

		showDeleteModal: function () {
			Event.fire('sites.delete_modal.show', this.props.site);
		},

		render: function() {
			var box = this.buildBox(),
				row_classes = 'site-box' + ' ' + this.state.status;

			var retry;
			if (this.state.status === 'retry') {
				retry = this.getCreateRetryOption();
			}

			if (this.state.status === 'delete_retry') {
				retry = this.getDeleteRetryOption();
			}

			var gear_options = {
				icon: 'glyphicon-cog',
				buttonClass: 'btn-cog',
				alignRight: true
			};

			return (
				<div id={'site-' + this.props.site.id} className={row_classes}>
					{retry}

					<DropDown className="site-box-cog" options={gear_options} links={box.gear} />

					<Row className="site-box-status">
						{box.status}
					</Row>
					<Row className="site-box-label">
						{box.link}
					</Row>
					<Row className="site-box-score">
						{box.score}
					</Row>
				</div>
			);
		}
	});
});
