define([
	'react',
	'moment',
	'jsx!components/common/score',
	'jsx!components/common/circle',
	'jsx!components/common/row',
	'jsx!components/common/icon',
	'jsx!components/common/spinner'
], function(
	React,
	Moment,
	Score,
	Circle,
	Row,
	Icon,
	Spinner
) {
	return React.createClass({
		buildMessage: function() {
			var site = this.props.site;
			var message = null;

			var updated = 'Unknown Date';
			if (_.isObject(site) && site.hasOwnProperty('complete_ts')) {
				updated = Moment.unix(site.complete_ts);
				updated = updated.format('MMM D, YYYY');
			}

			if (_.isString(site.status) && site.status === 'complete') {
				if (site.crawls > 1) {
					if (site.hasOwnProperty('prev') && _.isObject(site.prev)) {
						if (site.prev.change != 0) {
							var arrow = 'glyphicon glyphicon-triangle-bottom change-down';
							if (site.prev.change > 0) {
								arrow = 'glyphicon glyphicon-triangle-top change-up';
							}

							message = (
								<div>
									<span className="score-change">
										<strong>
											<Icon icon={arrow} /> {Math.abs(site.prev.change)}</strong>
									</span>
									<span className="score-details">Since {updated}</span>
								</div>
								);
						}
						else {
							message = (
								<div>
									<span className="score-details">No changes since {updated}</span>
								</div>
								);
						}
					}
					else {
						message = (
							<div>
								<span className="score-details">Previous data unavailable.</span>
							</div>
						);
					}
				}
				else {
					message = (
						<div>
							<span className="score-details">Analyzed on {updated}</span>
						</div>
					);
				}
			}
			else {
				if (site.crawls > 1) {
					message = (
						<div>
							<span className="score-details"><Spinner size="15" inline={true} /> New analysis in progress</span>
						</div>
					);
				}
				else {
					var current_pages = '0 pages';
					if (site.hasOwnProperty('current_session_pages')) {
						current_pages = site.current_session_pages == 1 ? '1 page' : site.current_session_pages + ' pages';
					}

					message = (
						<div>
							<span className="score-details">{current_pages} analyzed...</span>
						</div>
					);
				}
			}

			return message;
		},

		render: function() {
			var site = this.props.site;
			var message = this.buildMessage();

			var circle = null;
			var label = null;
			var animate = this.props.hasOwnProperty('animate') ? this.props.animate : true;

			if (site.crawls > 1 || (site.status == 'complete' && site.crawls == 1)) {
				label = (
					<span>Site Score</span>
				);

				circle = (
					<Circle fontSize={this.props.fontSize} percent={site.score} animate={animate} />
				);
			}

			return (
				<div className="score">
					<div className="score-label">
						{label}
					</div>
					<div className="score-circle">
						{circle}
					</div>
					<div className="score-message">
						{message}
					</div>
				</div>
			);
		}
	});
});