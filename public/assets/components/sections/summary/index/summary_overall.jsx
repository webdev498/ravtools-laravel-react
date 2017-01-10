define([
	'react',
	'underscore',
	'event',
	'jsx!components/sections/summary/index/summary_overall',
	'jsx!components/common/row',
	'jsx!components/common/score',
	'jsx!components/common/button',
	'jsx!components/common/loading',
	'jsx!components/common/guard'
], function(
	React,
	_,
	Event,
	Summary_Overall,
	Row,
	Score,
	Button,
	Loading,
	Guard
) {
	return React.createClass({
		initial_animate: true,

		render: function() {
			var summary = this.props.summary;

			if (_.isObject(summary)) {
				var site = summary.site;

				var buttonShare = {
					label: 'Share',
					icon: 'ravenicon ravenicon-share',
					onClick: function() {
						Event.fire('app.share_modal.show');
					}
				};

				var screenshot = '';
				if (_.isString(site.screenshot_thumb)) {
					screenshot = (
						<img src={site.screenshot_thumb} width="248" height="148" />
					);
				}

				var instructions = (
					<p>
						Fix the issues below to improve your score and to help improve your search engine rankings.  
						<Guard login={true}>
							You can also click the Share button to give other people access to this report.
						</Guard>
					</p>
				);
				if (site.hasOwnProperty('score') && site.score == 100) {
					instructions = (
						<p>You've reached 100!  That's a perfect score.  You can sit back and relax, or check the details of your page analysis.</p>
					);
				}

				var animate = this.initial_animate;
				this.initial_animate = false;

				return (
					<section id="summary-overall">
						<Row className="summary-overall">
							<div className="summary-overall-left">
								<div className="summary-screenshot-container">
									<div className="summary-screenshot">{screenshot}</div>
									<p className="summary-label">{site.url}</p>
								</div>
								<div className="summary-score-container">
									<div className="summary-score">
										<Score site={site} fontSize={'5.5rem'} animate={animate} />
									</div>
								</div>
							</div>
							<div className="summary-overall-right">
								{instructions}
								<Guard login={true}>
									<Button options={buttonShare} />
								</Guard>
							</div>
						</Row>
					</section>
				);
			}
			else {
				return (
					<Loading className="summary-overall" />
				);
			}
		}
	});
});
