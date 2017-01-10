define([
	'react',
	'event',
	'request',
	'issues',
	'jsx!components/sections/summary/index/summary_issues',
	'jsx!components/sections/summary/index/issuegrid',
	'jsx!components/common/column',
	'jsx!components/common/row',
	'jsx!components/common/link'
], function(
	React,
	Event,
	Request,
	Issues,
	Summary_Issues,
	IssueGrid,
	Column,
	Row,
	Link
) {
	return React.createClass({
		componentWillMount: function() {
			Event.add('summary.refresh.success', this.handleRefresh);
		},

		componentWillUnmount: function() {
			Event.remove('summary.refresh.success', this.handleRefresh);
		},

		componentDidMount: function() {
			this.handleRefresh();
		},

		handleRefresh: function() {
			var content = React.findDOMNode(this);

			$(content).find('.issue-box:even').addClass('stripe');
		},

		buildSummary: function(summary) {
			var issues = {};
			var pass = [];
			var ignored = [];
			var priorities = [];

			if (_.isObject(summary) && _.isObject(summary.sections)) {
				var sections = summary.sections;

				_.each(sections, function(section, section_code) {

					if(_.isObject(section) && _.isObject(section.stats)) {
						var stats = section.stats;

						_.each(stats, function(stat, stat_code) {
							stat.section = section_code;
							stat.code = stat_code;
							stat.noun = Issues[section_code]['noun'];
							stat.noun_plural = Issues[section_code]['noun_plural'];

							stat = _.extend(stat, Issues[section_code]['stats'][stat_code]);

							//todo: Hackety-Hack-Hack
							if (stat.total == 0) {
								stat.severity = 0;
							}

							if (_.isArray(summary.score_exclusions) && summary.score_exclusions.indexOf(section_code + '/' + stat_code) > -1) {
								stat.severity = 'ignored';
							}				

							if (stat.severity == 'ignored') {
								ignored.push(stat);
							}
							else if (stat.severity == 0) {
								pass.push(stat);
							}
							else {
								var collection = stat.severity;

								if (!issues.hasOwnProperty(collection)) {
									issues[collection] = [];
								}

								issues[collection].push(stat);
							}
						});
					}
				});
			}

			// Combines all severity arrays into a single array
			issues = _.flatten(_.values(issues));

			// Splits out Priority-Issues (top 5 issues)
			priorities = issues.splice(0, 5);

			/** Commenting out since UX direction was specifically to only show red issues above the fold. **
			if (priorities.length < 5 && pass.length >= 5 - priorities.length) { // if priorities is less than 5 and there are items in pass, fill out with items from pass
				var additional_items = pass.splice(0, 5 - priorities.length);
				
				priorities = priorities.concat(additional_items);
			}*/

			// Combine Issues (issues) with Non-Issues (pass) (Non-Issues are always at the end of the included issues)
			issues = issues.concat(pass);

			// Combine Ignored Issues (issues) with everything else (ignored) (Ignored issues are always at the end and gray)
			issues = issues.concat(ignored);

			// Adds `index` to each issues for listing purposes
			var index = 1;

			priorities = priorities.map(function(issue) {
				issue.index = index;
				index++;
				return issue;
			});

			issues = issues.map(function(issue) {
				issue.index = index;
				index++;
				return issue;
			});

			return {
				priorities: priorities,
				remaining: issues
			};
		},

		showAllIssues: function(event, site) {
			var link = 	event.target;
			var content = React.findDOMNode(this);

			$(content).find('section.remaining').removeClass('hide');
			$(content).find('.link-show-all').addClass('hide');
			$(content).find('.link-show-less').removeClass('hide');

			localStorage.setItem(site + '_issues', true);
		},

		showLessIssues: function(event, site) {
			var link = event.target;
			var content = React.findDOMNode(this);

			$(content).find('section.remaining').addClass('hide');
			$(content).find('.link-show-all').removeClass('hide');
			$(content).find('.link-show-less').addClass('hide');

			localStorage.removeItem(site + '_issues');
		},

		render: function() {
			var self = this;
			var summary = this.props.summary;
			var site = summary.site;

			var issues = self.buildSummary(summary);

			var listState = localStorage.getItem(site.id + '_issues');

			var linkShowAll = {
				label: (<strong>Show All</strong>),
				onClick: function(event) {
					self.showAllIssues(event, site.id);
				}
			};

			var linkShowLess = {
				label: (<strong>Show Less</strong>),
				onClick: function(event) {
					self.showLessIssues(event, site.id);
				}
			};

			var header = (<h2>Start Here.</h2>);
			if (site.hasOwnProperty('score') && site.score == 100) {
				header = (<h2>All Optimized!</h2>);
			}

			return (
				<section id="summary-issues">
					<Row>
						<Column width="12">
							{header}
							<section className="priorities">
								<IssueGrid site_id={site.id} issues={issues.priorities} />
							</section>
							<section className={'remaining' + ' ' + (listState ? '' : 'hide')}>
								<IssueGrid site_id={site.id} issues={issues.remaining} />
							</section>
						</Column>
					</Row>

					<Row>
						<Column width="12">
							<Link className={"pull-left link-show-all" + ' ' + (listState ? 'hide' : '')} options={linkShowAll} />
							<Link className={"pull-left link-show-less" + ' ' + (listState ? '' : 'hide')} options={linkShowLess} />
							<ul className="summary-legend pull-right">
								<li>
									<div className="legend severity-1"></div> critical fix
								</li>
								<li>
									<div className="legend severity-2"></div> could improve
								</li>
								<li>
									<div className="legend severity-3"></div> needs attention
								</li>
								<li>
									<div className="legend severity-0"></div> no problems
								</li>
								<li>
									<div className="legend severity-ignored"></div> hidden from score
								</li>
							</ul>
						</Column>
					</Row>
				</section>
			);
		}
	});
});
