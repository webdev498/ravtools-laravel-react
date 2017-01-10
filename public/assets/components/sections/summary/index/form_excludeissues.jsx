define([
	'react',
	'underscore',
	'request',
	'event',
	'issues',
	'jsx!components/sections/summary/index/form_excludeissues',
	'jsx!components/common/row',
	'jsx!components/common/form',
	'jsx!components/common/select',
	'jsx!components/common/button',
	'jsx!components/common/link',
	'jsx!components/common/icon'
], function(
	React,
	_,
	Request,
	Event,
	Issues,
	Form_Issues,
	Row,
	Form,
	Select,
	Button,
	Link,
	Icon
) {
	return React.createClass({
		getInitialState: function() {
			return {
				items: []
			};
		},

		componentWillMount: function() {
			this.getItems();

			Event.add('summary.form_excludeissues.success', this.handleSuccess);
			Event.add('summary.form_excludeissues.failure', this.handleFailure);
		},

		componentWillDismount: function() {
			Event.remove('summary.form_excludeissues.success', this.handleSuccess);
			Event.remove('summary.form_excludeissues.failure', this.handleFailure);
		},

		handleSuccess: function() {
			this.getItems();

			Event.fire('summary.settings_modal.updated');
		},

		handleFailure: function() {
			this.getItems();

			Event.fire('app.alert.show', {
				tag: 'summary.form_excludeissues',
				type: 'danger',
				message: (
					<p>
						<strong>issue</strong>
						Whoops, that did not seem to work.<br />Please try again.
					</p>
				)
			});
		},

		getItems: function() {
			var self = this;

			Request.get('/auditor/issueexclusions', {
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
				issue: data.issue
			});

			this.setState({
				items: items
			});

			Request.post('/auditor/issueexclusions/issueexclusion', {
				data: data,
				onSuccess: function(response) {
					if (_.isEmpty(response.id)) {
						Event.fire('summary.form_excludeissues.failure');
					}
					else {
						Event.fire('summary.form_excludeissues.success');
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

				Request.delete('/auditor/issueexclusions/issueexclusion/' + item_id, {
					onSuccess: function(response) {
						if (response.hasOwnProperty('deleted') && response.deleted == true) {
							Event.fire('summary.form_excludeissues.success');
						}
						else {
							Event.fire('summary.form_excludeissues.failure');
						}
					}
				});
			}
		},

		buildSelect: function() {
			var options = [],
				excluded_list = [],
				section,
				i;

			for (i in this.state.items) {
				if (parseInt(this.state.items[i].score_only) === 0) {
					excluded_list.push(this.state.items[i].issue);	
				}
			}

			for (section in Issues) {
				if (!Issues.hasOwnProperty(section)) continue;
				var option = {};
				var stats = Issues[section]['stats'];

				for (var code in stats) {
					if (!stats.hasOwnProperty(code)) continue;

					option = {
						label: Issues[section]['label'] + ' / ' + stats[code]['label'],
						value: section + '/' + code
					};

					if (excluded_list.indexOf(option.value) === -1) {
						options.push(option);
					}
				}
			}

			return (
				<Select name="issue" options={options} />
			);
		},

		buildItems: function() {
			var self = this,
				items = self.state.items,
				excluded_list = [],
				i;

			for (i in items) {
				if (parseInt(this.state.items[i].score_only) === 1) {
					excluded_list.push(this.state.items[i].id);
				}
			}

			return items.map(function(item, i) {
				if (excluded_list.indexOf(item.id) > -1) {
					return false;
				}

				var key = _.uniqueId('excludeissue-');

				var buttonDelete = {
					label: (<Icon icon="ravenicon ravenicon-minus" />),
					buttonClass: 'btn-primary btn-circle btn-delete',
					onClick: function(event) {
						self.deleteItem(event, item.id)
					}
				};

				/* Converts the issue section/code into literal section/code */
				var section = '--';
				var code = '--';
				if (item.hasOwnProperty('issue')) {
					var issue = item.issue.split('/');
					if (issue.length > 0) {
						section = Issues[issue[0]]['label'];
						code = Issues[issue[0]]['stats'][issue[1]]['label'];
					}
				}

				return (
					<li key={key} className="list-group-item">
						<Button options={buttonDelete} />
						<span>{section + ' / ' + code}</span>
					</li>
				);
			});
		},

		handleSubmit: function(inputs) {
			this.addItem(inputs);
		},

		render: function() {
			var self = this;
			var items = self.buildItems();
			var select = self.buildSelect();

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
					<h4>Exclude Issues</h4>

					<Row className="modal-bg">
						<Form className="form-inline" onSubmit={self.handleSubmit}>
							<div className="input-group">
								{select}
								<span className="input-group-btn">
									<Button type="submit" options={buttonAdd} />
								</span>
							</div>
						</Form>

						<ul className="list-group">
							{items}
						</ul>

						<p>Learn more about issue exclusions. <Link options={linkHelp} /></p>
					</Row>
				</div>
			);
		}
	});
});