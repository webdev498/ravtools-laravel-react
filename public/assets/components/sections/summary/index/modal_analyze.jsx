define([
	'react',
	'event',
	'request',
	'underscore',
	'jsx!components/sections/summary/index/modal_analyze',
	'jsx!components/common/modal',
	'jsx!components/common/row',
	'jsx!components/common/column',
	'jsx!components/common/select',
	'jsx!components/common/button',
	'jsx!components/common/link',
	'jsx!components/common/icon'
], function(
	React,
	Event,
	Request,
	_,
	Modal_Analyze,
	Modal,
	Row,
	Column,
	Select,
	Button,
	Link,
	Icon
) {
	return React.createClass({
		getInitialState: function() {
			return {
				frequency: '',
				day: '',
				button: false
			}
		},

		componentWillMount: function() {
			Event.add('summary.analyze_modal.show', this.showModal);
			Event.add('summary.analyze_modal.hide', this.hideModal);

			Event.add('summary.analyze_saved.success', this.handleSuccess);
			Event.add('summary.analyze_saved.error', this.handleError);
		},

		componentWillUnmount: function() {
			Event.remove('summary.analyze_modal.show', this.showModal);
			Event.remove('summary.analyze_modal.hide', this.hideModal);

			Event.remove('summary.analyze_saved.success', this.handleSuccess);
			Event.remove('summary.analyze_saved.error', this.handleError);
		},

		showModal: function(event) {
			var modal = React.findDOMNode(this);

			if (_.isObject(event.detail)) {
				this.setState({
					frequency: event.detail.settings.schedule_frequency,
					day: event.detail.settings.schedule_day
				});
			}
			else if (_.isObject(this.props.summary)) {
				var site = this.props.summary.site;

				this.setState({
					frequency: site.crawl_interval,
					day: site.crawl_interval_setting
				});
			}

			$(modal).modal('show');
		},

		hideModal: function() {
			var modal = React.findDOMNode(this);

			this.setState({
				button: false
			});

			$(modal).modal('hide');
		},

		handleChange: function(event) {
			var modal = React.findDOMNode(this);
			var frequency = $(modal).find('[name="schedule_frequency"]').val();
			var day = $(modal).find('[name="schedule_day"]').val();

			this.setState({
				frequency: frequency,
				day: day,
				button: true
			});
		},

		buildWeekly: function() {
			var options = [
				{
					label: 'Sundays',
					value: 'sun'
				},
				{
					label: 'Mondays',
					value: 'mon'
				},
				{
					label: 'Tuesdays',
					value: 'tue'
				},
				{
					label: 'Wednesdays',
					value: 'wed'
				},
				{
					label: 'Thursdays',
					value: 'thu'
				},
				{
					label: 'Fridays',
					value: 'fri'
				},
				{
					label: 'Saturdays',
					value: 'sat'
				}
			];

			return (
				<Select name="schedule_day" label="On" options={options} value={this.state.day} onChange={this.handleChange} />
			);
		},

		buildMonthly: function() {
			var options = [];

			for (var i = 1; i <= 28; i++) {
				var ordinal = function(i) {
					var s = ['th', 'st', 'nd', 'rd'],
						v = i % 100;
					return i+(s[(v-20)%10]||s[v]||s[0]);
				};

				options.push({
					label: ordinal(i),
					value: i
				});
			}

			return (
				<Select name="schedule_day" label="On the" options={options} value={this.state.day} onChange={this.handleChange} />
			);
		},

		handleForm: function() {
			var modal = React.findDOMNode(this);
			modal = $(modal);

			var this_form = modal.find('form'),
				form_data = this_form.serializeArray(),
				formatted_data = {};

			if (_.isArray(form_data)) {
				_.each(form_data, function(form_item) {
					formatted_data[form_item.name] = form_item.value;
				});
			}

			return formatted_data;
		},

		submit: function(method) {
			var self = this;
			var settings = self.handleForm();

			settings.site_id = self.props.site_id;
			settings.method = method;

			self.hideModal();

			Request.post('/auditor/sites/site/crawl', {
				data: settings,
				onSuccess: function() {
					Event.fire('summary.analyze_saved.success');
				},
				onError: function() {
					Event.fire('summary.analyze_saved.error', {
						settings: settings
					});
				}
			});
		},

		handleSuccess: function() {
			Event.fire('summary.refresh');
		},

		handleError: function(event) {
			var options = {
				label: 'Retry',
				onClick: function() {
					Event.fire('summary.analyze_modal.show', {
						settings: event.detail.settings
					});
				}
			};

			Event.fire('app.alert.show', {
				tag: 'summary.analyze',
				type: 'danger',
				persist: true,
				message: (
					<p>
						<strong>Error</strong>
						Whoops, let's try that again.<br /><Link options={options} />
					</p>
				)
			});
		},

		render: function() {
			var self = this;

			var manual_button = {
				label: 'Analyze Now',
				buttonClass: 'btn-primary',
				onClick: function() {
					self.submit('manually');
				}
			};

			var schedule_button = null;

			if (this.state.button == true) {
				schedule_button = (
					<Button options={{
						label: 'Schedule',
						buttonClass: 'btn-primary',
						onClick: function() {
							self.submit('scheduled');
						}
					}} />
				);
			}


			var frequency_options = [
				{
					label: 'None',
					value: 'manual'
				},
				{
					label: 'Weekly',
					value: 'weekly'
				},
				{
					label: 'Monthly',
					value: 'monthly'
				}
			];

			var day_input = null;

			switch(this.state.frequency) {
				case 'weekly':
					day_input = this.buildWeekly();
					break;
				case 'monthly':
					day_input = this.buildMonthly();
					break;
				case 'manual':
				default:
					day_input = false;
					break;
			}

			var frequency = (
				<div>
					<div className="frequency-fields">
						<Icon icon="ravenicon ravenicon-calendar" />
						<p>no scheduled crawls</p>
					</div>
					{schedule_button}
				</div>
			);
			if (day_input) {
				frequency = (
					<div>
						<div className="frequency-fields">
							{day_input}
						</div>
						{schedule_button}
					</div>
				);
			}

			return (
				<Modal id="analyze-modal" title="Analyze" onHide={this.hideModal}>
					<form>
						<Row>
							<Column width="6">
								<h4>Manually</h4>
								<Row className="analyze-manual-container modal-bg">
									<p><strong>Manually every time</strong></p>
									<Button parent_id="analyze-modal" options={manual_button} />
								</Row>
							</Column>

							<Column width="6">
								<h4>Scheduled</h4>
								<Row className="analyze-frequency-container modal-bg">
									<Select name="schedule_frequency" label="Frequency" options={frequency_options} value={this.state.frequency} onChange={this.handleChange} />
									{frequency}
								</Row>
							</Column>
						</Row>
					</form>
				</Modal>
			);
		}
	});
});