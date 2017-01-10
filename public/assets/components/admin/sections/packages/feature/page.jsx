define([
	'react',
	'underscore',
	'request',
	'jsx!components/admin/layouts/page',
	'jsx!components/admin/sections/packages/feature/page',
	'jsx!components/admin/sections/packages/feature/packages_table',
	'jsx!components/common/loading',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/breadcrumb',
	'jsx!components/common/link',
	'jsx!components/common/panel'
], function(
	React,
	_,
	Request,
	Layout,
	Page,
	Packages_Table,
	Loading,
	Row,
	Column,
	Breadcrumb,
	Link,
	Panel
) {
	return React.createClass({
		getInitialState: function() {
			return {
				feature: null
			}
		},

		componentWillMount: function() {
			this.getFeature(this.props.feature_id);
		},

		getFeature: function(feature_id) {
			var self = this;

			Request.get('/admin/features/feature', {
				data: {
					feature_id: feature_id
				},

				onSuccess: function(data) {
					self.setState({
						feature: data
					});
				}
			});
		},

		render: function() {
			var feature = this.state.feature;

			if (!_.isObject(feature)) {
				return (
					<Layout id="feature-page" className="single-page">
						<Breadcrumb />
						<Loading />
					</Layout>
				);
			}

			return (
				<Layout id="feature-page" className="single-page">
					<Breadcrumb />
					<Row>
						<Column width="12">
							<h1>{feature.name} <small>Feature</small></h1>
						</Column>
					</Row>
					<Row>
						<Column width="3">
							<Panel title="General">
								<dl>
									<dt>ID</dt>
									<dd>{feature.id}</dd>

									<dt>Name</dt>
									<dd>{feature.name}</dd>
								</dl>
							</Panel>
						</Column>
						<Column width="9">
							<section>
								<h3>Packages</h3>
								<Packages_Table feature_id={this.props.feature_id} />
							</section>
						</Column>
					</Row>
				</Layout>
			);
		}
	});
});