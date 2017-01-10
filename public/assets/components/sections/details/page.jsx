define([
	'react',
	'auth',
	'issues',
	'event',
	'underscore',
	'jsx!components/sections/details/page',
	'jsx!components/sections/details/pagetitle',
	'jsx!components/app/modal_share',
	'jsx!components/layouts/page',
	'jsx!components/common/column',
	'jsx!components/common/row',
	'jsx!components/common/button',
	'jsx!components/common/icon',
	'jsx!components/common/guard'
], function(
	React,
	Auth,
	Issues,
	Event,
	_,
	Page,
	PageTitle,
	Modal_Share,
	Layout,
	Column,
	Row,
	Button,
	Icon,
	Guard
) {
	return React.createClass({
		render: function() {
			var self = this;

			var stat = Issues[self.props.stat.section]['stats'][self.props.stat.code];

			var token = Auth.getToken();

			var header = (<PageTitle site_id={this.props.site_id} breadcrumb={this.props.breadcrumb} />);

			var modals = [
				(<Modal_Share site_id={this.props.site_id} />)
			];

			var learn_button = false;
			if (stat.hasOwnProperty('info')) {
				var options = {
					label: 'Learn How to Fix This',
					buttonClass: 'btn-primary btn-phone-wide',

					onClick: function(event) {
						window.open(stat.info, 'details-info');
					}
				};

				learn_button = (<Button options={options} />);
			}

			var share_button = false;

			var options = {
				label: 'Share',
				icon: 'ravenicon ravenicon-share',
				buttonClass: 'btn-default btn-phone-wide',

				onClick: function(event) {
					Event.fire('app.share_modal.show');
				}
			};

			share_button = (
				<Button options={options} />
			);

			var badge = "severity-0";
			if (stat.severity > 0) {
				badge = "severity-" + stat.severity;
			}

			var subheading = null;
			if (this.props.hasOwnProperty('subheading') && _.isString(this.props.subheading)) {
				subheading = (
					<small><Icon icon={'glyphicon glyphicon-menu-right'} />{this.props.subheading}</small>
				);
			}

			var descriptionHTML = function() {
				return {__html: stat.description};
			};

			return (
				<Layout id="details-page" type="single" header={header} modals={modals}>
					<Column>
						<Row className="details-info">
							<Column width="12">
								<div className={'details-badge' + ' ' + badge} />
								<h3>
									{stat.label}
									{subheading}
								</h3>
								<Column className="details-left" width="8">
									<p dangerouslySetInnerHTML={descriptionHTML()}></p>
								</Column>
								<Column className="details-right" width="4">
									<div className="btn-toolbar">
										{learn_button}

										<Guard login={true}>
											{share_button}
										</Guard>
									</div>
								</Column>
							</Column>
						</Row>
						{self.props.table}
					</Column>
				</Layout>
			);
		}
	});
});
