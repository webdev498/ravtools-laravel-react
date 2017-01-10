define([
	'react',
	'underscore',
	'jquery',
	'validate',
	'event',
	'request',
	'jsx!components/sections/sites/index/form_analyze',
	'jsx!components/common/row',
	'jsx!components/common/form',
	'jsx!components/common/text',
	'jsx!components/common/button'
], function(
	React,
	_,
	$,
	validate,
	Event,
	Request,
	Form_Analyze,
	Row,
	Form,
	Text,
	Button
) {
	return React.createClass({
		componentWillMount: function () {
			Event.add('sites.analyze_form.retry', this.handleRetry);
		},

		componentWillUnmount: function () {
			Event.remove('sites.analyze_form.retry', this.handleRetry);
		},

		componentDidMount: function() {
			var self = this;
			var loginUrl = 	localStorage.getItem('loginUrl');

			if (!_.isEmpty(loginUrl) && _.isString(loginUrl)) {
				setTimeout(function() {
					self.handleSubmit({
						url: loginUrl
					});
				}, 250);
			}
		},

		handleRetry: function (event) {
			var element = React.findDOMNode(this);

			if (_.isObject(event.detail)) {
				$(element).find('input[name="url"]').val(event.detail.site.url);
			}
		},

		handleValidate: function(inputs) {
			if (!/^https?\:\/\//.test(inputs.url)) {
				inputs.url = 'http://' + inputs.url;
			}

			return validate(inputs, {
				url: {
					presence: true,
					url: true
				}
			});
		},

		handleSubmit: function(inputs) {
			var self = this;

			localStorage.removeItem('loginUrl');

			if (this.props.hasOwnProperty('enableAnalyze') && this.props.enableAnalyze == true) {
				Event.fire('sites.created', {
					url: inputs.url
				});

				Request.post('/auditor/sites/site', {
					data: inputs,

					onSuccess: function () {
						self.handleSuccess();
					},

					onFailure: function () {
						self.handleError();
					}
				});
			}
			else {
				Event.fire('app.upgrade_modal.show');
				Event.fire('site.refresh');
			}
		},

		handleSuccess: function() {
			Event.fire('sites.created.success');
		},

		handleError: function(event) {
			var options = {
				label: 'Retry',
				onClick: function() {
					Event.fire('sites.analyze_form.retry', {
						settings: event.detail.settings
					});
				}
			};

			Event.fire('sites.created.error');

			Event.fire('app.alert.show', {
				tag: 'sites.add_site',
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

			var options = {
				label: 'Analyze New Site',
				buttonClass: 'btn-primary'
			};

			return (
				<Form className="form-inline" onValidate={self.handleValidate} onSubmit={self.handleSubmit}>
					<div className="input-group">
						<Text name="url" type="text" inputmode="url" placeholder="Enter site URL to analyze a new site" />
						<span className="input-group-btn">
							<Button type="submit" options={options} />
						</span>
					</div>
				</Form>
			);
		}
	});
});
