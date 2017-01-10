define([
	'react',
	'jsx!components/app/bottom',
	'jsx!components/common/row',
	'jsx!components/common/column'
], function(
	React,
	Bottom,
	Row,
	Column
) {
	return React.createClass({
		render: function() {
			var currentYear = new Date().getFullYear();

			return (
				<div id="bottom">
					<Row>
						<Column width="12">
							<p>&copy; 2007-{currentYear} Raven Internet Marketing Tools. All Rights Reserved. <a href="https://raventools.com/tos/" target="_blank">Terms of Service</a> and <a href="https://raventools.com/privacy/" target="_blank">Privacy Policy</a>.</p>
						</Column>
					</Row>
				</div>
			);
		}
	});
});
