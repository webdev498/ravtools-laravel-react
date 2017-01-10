define([
	'react',
	'underscore',
	'request',
	'jsx!components/admin/layouts/page',
	'jsx!components/admin/sections/packages/package/page',
	'jsx!components/admin/sections/packages/package/features_table',
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
	Features_Table,
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
				packageObj: null
			}
		},

		componentWillMount: function() {
			this.getPackage(this.props.package_id);
		},

		getPackage: function(package_id) {
			var self = this;

			Request.get('/admin/packages/package', {
				data: {
					package_id: package_id
				},

				onSuccess: function(data) {
					self.setState({
						packageObj: data
					});
				}
			});
		},

		render: function() {
			var packageObj = this.state.packageObj;

			if (!_.isObject(packageObj)) {
				return (
					<Layout id="package-page" className="single-page">
						<Breadcrumb />
						<Loading />
					</Layout>
				);
			}

			return (
				<Layout id="package-page" className="single-page">
					<Breadcrumb />
					<Row>
						<Column width="12">
							<h1>{packageObj.name} <small>Package</small></h1>
						</Column>
					</Row>
					<Row>
						<Column width="3">
							<Panel title="General">
								<dl>
									<dt>ID</dt>
									<dd>{packageObj.id}</dd>

									<dt>Name</dt>
									<dd>{packageObj.name}</dd>

									<dt>Cost</dt>
									<dd>$ {packageObj.cost}</dd>
								</dl>
							</Panel>
						</Column>
						<Column width="9">
							<section>
								<h3>Features</h3>
								<Features_Table package_id={this.props.package_id} />
							</section>
						</Column>
					</Row>
				</Layout>
			);
		}
	});
});