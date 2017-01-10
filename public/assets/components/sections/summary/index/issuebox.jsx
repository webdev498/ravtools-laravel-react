define([
	'react',
	'request',
	'underscore',
	'event',
	'jsx!components/sections/summary/index/issuebox',
	'jsx!components/common/row',
	'jsx!components/common/link',
	'jsx!components/common/dropdown',
	'jsx!components/common/guard'
], function(
	React,
	Request,
	_,
	Event,
	IssueBox,
	Row,
	Link,
	DropDown,
	Guard
) {
	return React.createClass({
		ignoreIssue: function(options) {
			options.score_only = 1; // this is the only difference from hideIssue

			Request.post('/auditor/issueexclusions/issueexclusion', {
				data: options,
				onSuccess: function(response) {
					if (_.isEmpty(response.id)) {
						Event.fire('summary.form_excludeissues.failure');
					}
					else {
						Event.fire('summary.form_excludeissues.success');
						Event.fire('summary.refresh');
					}
				}
			});
		},

		includeIssue: function(options) {
			Request.delete('/auditor/issueexclusions/issueexclusion', {
				data: options,
				onSuccess: function(response) {
					if (response.hasOwnProperty('deleted') && response.deleted == true) {
						Event.fire('summary.form_excludeissues.success');
						Event.fire('summary.refresh');
					}
					else {
						Event.fire('summary.form_excludeissues.failure');
					}
				}
			});
		},

		hideIssue: function(options) {
			options.score_only = 0; // this means exclude it from everything

			Request.post('/auditor/issueexclusions/issueexclusion', {
				data: options,
				onSuccess: function(response) {
					if (_.isEmpty(response.id)) {
						Event.fire('summary.form_excludeissues.failure');
					}
					else {
						Event.fire('summary.form_excludeissues.success');
						Event.fire('summary.refresh');
					}
				}
			});
		},

		render: function() {
			var self = this;
			var issue = self.props.issue;

			var noun = issue.noun;
			var predicate = issue.predicate;
			var subject = null;

			if (issue.total > 0) {
				// Plural
				if (issue.total > 1) {
					noun = issue.noun_plural;
					predicate = issue.predicate_plural;
				}

				subject = (<Link options={ {
					label: issue.total + ' ' + noun,
					url: issue.rel
				} } />);
			}
			else {
				subject = '0 ' + issue.noun_plural;
				predicate = issue.predicate_plural;
			}

			var dropdownOptions = {
				icon: 'glyphicon-cog',
				buttonClass: 'btn-cog',
				alignRight: true
			};

			var dropdownLinks = [
				{
					type: 'link',
					label: 'Ignore from score',
					onClick: function() {
						self.ignoreIssue({
							site_id: self.props.site_id,
							issue: issue.section + '/' + issue.code
						});
					}
				}
			];

			if (issue.severity == 'ignored') {
				dropdownLinks = [
					{
						type: 'link',
						label: 'Include in score',
						onClick: function() {
							self.includeIssue({
								site_id: self.props.site_id,
								issue: issue.section + '/' + issue.code
							});
						}
					}
				];
			}

			dropdownLinks.push({
				type: 'link',
				label: 'Hide from report',
				onClick: function() {
					self.hideIssue({
						site_id: self.props.site_id,
						issue: issue.section + '/' + issue.code
					});
				}
			});

			return (
				<Row className="issue-box">
					<div className={'issue-badge pull-left severity-' + issue.severity}>{issue.index}</div>
					<Guard login={true}>
						<div className="issue-actions pull-right">
							<DropDown options={dropdownOptions} links={dropdownLinks} />
						</div>
					</Guard>
					<p className="issue-header">
						{subject} {predicate}
					</p>
					<p className="issue-brief">
						{issue.brief}
					</p>
				</Row>
			)
		}
	});
});