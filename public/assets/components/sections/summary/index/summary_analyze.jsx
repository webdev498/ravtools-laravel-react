define([
	'react',
	'event',
	'underscore',
	'jsx!components/sections/summary/index/summary_analyze',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/button',
	'jsx!components/common/guard'
], function(
	React,
	Event,
	_,
	Summary_Analyze,
	Row,
	Column,
	Button,
	Guard
) {
	return React.createClass({
		render: function() {
			var summary = this.props.summary;

			if (_.isObject(summary)) {
				var site = summary.site;

				if (site.hasOwnProperty('score') && site.score == 100) {
					return (
						<section id="summary-analyze"></section>
					);
				}

				var buttonAnalyze = {
					label: 'Re-Analyze',
					buttonClass: 'btn-primary btn-phone-wide',
					onClick: function() {
						Event.fire('summary.analyze_modal.show');
					}
				};

				var buttonSettings = {
					label: 'Settings',
					buttonClass: 'btn-default btn-phone-wide',
					onClick: function() {
						Event.fire('summary.settings_modal.show');
					}
				};

				return (
					<Guard login={true}>
						<section id="summary-analyze">
							<Row>
								<Column className="wrapper" width="12">
									<p>Re-analyze when you're ready to verify your changes and update your Site Score.</p>
									<Button options={buttonAnalyze} />
								</Column>
								<Column className="settings-wrapper" width="12">
									<Button options={buttonSettings} />
								</Column>
							</Row>
						</section>
					</Guard>
				);
			}
			else {
				return (
					<section id="summary-analyze"></section>
				);
			}
		}
	});
});