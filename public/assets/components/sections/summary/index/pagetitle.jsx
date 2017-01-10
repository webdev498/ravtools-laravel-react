define([
	'react',
	'underscore',
	'moment',
	'event',
	'auth',
	'jsx!components/sections/summary/index/pagetitle',
	'jsx!components/common/pagetitle',
	'jsx!components/common/breadcrumb',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/button',
	'jsx!components/common/guard',
	'jsx!components/common/messages'
], function(
	React,
	_,
	Moment,
	Event,
	Auth,
	Summary_PageTitle,
	PageTitle,
	Breadcrumb,
	Row,
	Column,
	Button,
	Guard,
	Messages
) {
	return React.createClass({
		openAnalyze: function(event) {
			Event.fire('summary.analyze_modal.show');
		},

		openSettings: function(event) {
			Event.fire('summary.settings_modal.show');
		},

		render: function() {
			var self = this;

			var buttonAnalyze = {
				label: 'Re-Analyze',
				buttonClass: 'btn-primary',
				onClick: function(event) {
					self.openAnalyze(event);
				}
			};

			var buttonSettings = {
				label: 'Settings',
				onClick: function(event) {
					self.openSettings(event);
				}
			};

			var summary = this.props.summary;

			var note = null;
			if (_.isObject(this.props.summary)) {
				var site = this.props.summary.site;

				var pages = (<strong>{summary.total.pages || 0} pages</strong>);
				var date = Moment.unix(site.complete_ts);
				date = date.format('MMMM D, YYYY');
				date = (<span>analyzed on {date}</span>);

				note = (<span>{pages} {date}</span>)
			}

			return (
				<div id="summary-pagetitle">
					<Guard login={true}>
						<Breadcrumb label="Back to Site List" url="#sites" />
					</Guard>
					
					<PageTitle>
						<Row>
							<Column width="6">
								<h1>Report Summary</h1>
							</Column>
							<Column width="6">
								<div className="float-right">
									<span className="note">{note}</span>
									<span className="btn-toolbar">
										<Guard login={true}>
											<Button options={buttonAnalyze} />
											<Button options={buttonSettings} />
										</Guard>
									</span>
								</div>
							</Column>
						</Row>
					</PageTitle>
					<Messages />
				</div>
			);
		}
	});
});
