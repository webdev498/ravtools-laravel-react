define([
	'react',
	'underscore',
	'request',
	'event',
	'jsx!components/sections/sites/index/sitegrid',
	'jsx!components/sections/sites/index/sitebox',
	'jsx!components/common/loading',
	'jsx!components/common/row',
	'jsx!components/common/icon',
	'jsx!components/common/spinner'
], function(
	React,
	_,
	Request,
	Event,
	SiteGrid,
	SiteBox,
	Loading,
	Row,
	Icon,
	Spinner
) {
	return React.createClass({
		initial_animate: true,

		render: function() {
			var self = this;
			var sites = self.props.sites;

			if (!_.isArray(sites)) {
				return (
					<Loading className="site-grid">
						<div className="site-box ghost">
							<Spinner size="50" />
						</div>
					</Loading>
				);
			}

			if (_.isArray(sites) && sites.length === 0) {
				return (
					<Row className="no-sites">
						<h2>You have no sites.</h2>
					</Row>
				);
			}

			var boxes = sites.map(function(site) {
				return (
					<SiteBox key={_.uniqueId('sitebox-')} site={site} animate={self.initial_animate} />
				);
			});

			self.initial_animate = false;

			return (
				<Row className="site-grid">
					{boxes}
				</Row>
			);
		}
	});
});
