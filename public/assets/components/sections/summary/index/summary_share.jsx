define([
	'react',
	'underscore',
	'event',
	'jsx!components/sections/summary/index/summary_share',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/link',
	'jsx!components/common/button',
	'jsx!components/common/guard'
], function(
	React,
	_,
	Event,
	Summary_Share,
	Row,
	Column,
	Link,
	Button,
	Guard
) {
	return React.createClass({
		render: function() {
			var summary = this.props.summary;

			if (!_.isObject(summary)) {
				return (
					<section id="summary-share"></section>
				);
			}

			var site = summary.site;

			var linkLabel = (
				<p>Need help with these fixes{'?'} <strong>Share</strong> the list of changes with someone who can help.</p>
			);

			if (site.hasOwnProperty('score') && site.score == 100) {
				linkLabel = (
					<p>Want to brag{'?'} <strong>Share</strong> the list of awesomeness with someone.</p>
				);
			}

			var linkShare = {
				label: linkLabel,
				onClick: function() {
					Event.fire('app.share_modal.show');
				}
			};

			var buttonShare = {
				label: 'Share',
				icon: 'ravenicon ravenicon-share',
				buttonClass: 'btn-share btn-phone-wide',
				onClick: function() {
					Event.fire('app.share_modal.show');
				}
			};

			return (
				<Guard login={true}>
					<section id="summary-share">
						<Row>
							<Column width="12">
								<Link options={linkShare} />
								<Button options={buttonShare} />
							</Column>
						</Row>
					</section>
				</Guard>
			);
		}
	});
});