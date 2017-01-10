define([
	'react',
	'underscore',
	'validate',
	'request',
	'event',
	'jsx!components/sections/summary/index/form_excludepaths',
	'jsx!components/common/row',
	'jsx!components/common/form',
	'jsx!components/common/text',
	'jsx!components/common/button',
	'jsx!components/common/link',
	'jsx!components/common/icon'
], function(
	React,
	_,
	validate,
	Request,
	Event,
	Form_Paths,
	Row,
	Form,
	Text,
	Button,
	Link,
	Icon
) {
	return React.createClass({
		getInitialState: function() {
			return {
				items: []
			}
		},

		componentWillMount: function() {
			this.getItems();

			Event.add('summary.form_excludepaths.success', this.handleSuccess);
			Event.add('summary.form_excludepaths.failure', this.handleFailure);
		},

		componentWillDismount: function() {
			Event.remove('summary.form_excludepaths.success', this.handleSuccess);
			Event.remove('summary.form_excludepaths.failure', this.handleFailure);
		},

		handleSuccess: function() {
			this.getItems();

			Event.fire('summary.settings_modal.updated');
		},

		handleFailure: function() {
			this.getItems();

			Event.fire('app.alert.show', {
				tag: 'summary.form_excludepaths',
				type: 'danger',
				message: (
					<p>
						<strong>Error</strong>
						Whoops, that did not seem to work.<br />Please try again.
					</p>
				)
			});
		},

		getItems: function() {
			var self = this;

			Request.get('/auditor/pathexclusions', {
				data: {
					site_id: this.props.site_id
				},
				onSuccess: function(response) {
					self.setState({
						items: response.data
					});
				}
			});
		},

		addItem: function(data) {
			data.site_id = this.props.site_id;

			var items = this.state.items;
			items.push({
				id: '-',
				path: data.path
			});

			this.setState({
				items: items
			});

			Request.post('/auditor/pathexclusions/pathexclusion', {
				data: data,
				onSuccess: function(response) {
					if (!_.isEmpty(response.id)) {
						Event.fire('summary.form_excludepaths.success');
					}
					else {
						Event.fire('summary.form_excludepaths.failure');
					}
				}
			});
		},

		deleteItem: function(event, item_id) {
			var items = this.state.items;

			var removeIndex = _.findIndex(items, function(item) {
				return item.id == item_id;
			});

			if (removeIndex >= 0) {
				items.splice(removeIndex, 1);

				this.setState({
					items: items
				});

				Request.delete('/auditor/pathexclusions/pathexclusion', {
					data: {
						'exclusion_id': item_id
					},
					onSuccess: function(response) {
						if (response.hasOwnProperty('deleted') && response.deleted == true) {
							Event.fire('summary.form_excludepaths.success');
						}
						else {
							Event.fire('summary.form_excludepaths.failure');
						}
					}
				});
			}
		},

		buildItems: function() {
			var self = this;
			var items = self.state.items;

			return items.map(function(item, i) {
				var key = _.uniqueId('excludepath-');

				var buttonDelete = {
					label: (<Icon icon="ravenicon ravenicon-minus" />),
					buttonClass: 'btn-primary btn-circle btn-delete',
					onClick: function(event) {
						self.deleteItem(event, item.id);
					}
				};

				return (
					<li key={key} className="list-group-item">
						<Button options={buttonDelete} />
						<span>{item.path}</span>
					</li>
				);
			});
		},

		handleValidate: function(inputs) {
			return validate(inputs, {
				path: {
					presence: true
				}
			});
		},

		handleSubmit: function(inputs) {
			this.addItem(inputs);
		},

		render: function() {
			var self = this;
			var items = self.buildItems();

			var buttonAdd = {
				label: (<Icon icon="ravenicon ravenicon-plus" />),
				buttonClass: 'btn-primary btn-circle btn-add'
			};

			var linkHelp = {
				label: (<strong>Help <Icon icon="ravenicon ravenicon-question-mark" /></strong>),
				target: '_blank',
				url: 'http://www.raventools.com',
				updateHash: false
			};

			return (
				<div>
					<h4>Exclude Paths</h4>

					<Row className="modal-bg">
						<Form className="form-inline" onValidate={self.handleValidate} onSubmit={self.handleSubmit}>
							<div className="input-group">
								<Text name="path" />
								<span className="input-group-btn">
									<Button type="submit" options={buttonAdd} />
								</span>
							</div>
						</Form>

						<ul className="list-group">
							{items}
						</ul>

						<p>Learn more about path exclusions. <Link options={linkHelp} /></p>
					</Row>
				</div>
			);
		}
	});
});