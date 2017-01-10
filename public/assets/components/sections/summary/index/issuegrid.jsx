define([
	'react',
	'underscore',
	'jsx!components/sections/summary/index/issuegrid',
	'jsx!components/sections/summary/index/issuebox',
	'jsx!components/common/row'
], function(
	React,
	_,
	IssueGrid,
	IssueBox,
	Row
) {
	return React.createClass({
		render: function() {
			var self = this;
			var issues = self.props.issues;

			if (!_.isArray(issues) || issues.length === 0) {
				return (
					<Row>
						No issues available.
					</Row>
				);
			}

			var boxes = issues.map(function(issue) {
				return (
					<IssueBox key={_.uniqueId('issuebox-')} site_id={self.props.site_id} issue={issue} />
				);
			});


			return (
				<div className="issue-grid">
					{boxes}
				</div>
			)
		}
	});
});