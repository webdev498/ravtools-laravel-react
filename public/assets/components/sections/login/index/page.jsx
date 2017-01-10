define([
	'react',
	'underscore',
	'jquery',
	'validate',
	'auth',
	'event',
	'request',
	'jsx!components/sections/login/index/page',
	'jsx!components/layouts/page',
	'jsx!components/common/column',
	'jsx!components/common/row',
	'jsx!components/common/form',
	'jsx!components/common/button',
	'jsx!components/common/text'
], function(
	React,
	_,
	$,
	validate,
	Auth,
	Event,
	Request,
	Page,
	Layout,
	Column,
	Row,
	Form,
	Button,
	Text
) {
	return React.createClass({
		componentWillMount: function() {
			if (Auth.isLoggedIn()) {
				Router.navigate('#sites', {trigger: true});
			}
			else {
				if (Auth.getTempToken()) {
					Auth.clearAuth();
					window.location.reload();
				}
			}
		},

		handleValidate: function(inputs) {
			// it's okay if no url is provided on the login form.
			if (!_.isString(inputs.url) || inputs.url.length === 0) {
				return false;
			}

			if (!/^https?\:\/\//.test(inputs.url)) {
				inputs.url = 'http://' + inputs.url;
			}

			return validate(inputs, {
				url: {
					presence: false,
					url: true
				}
			});
		},

		handleSubmit: function(inputs) {
			Auth.handleLogin(function() {
				if (_.isString(inputs.url)) {
					localStorage.setItem('loginUrl', inputs.url);
				}

				Router.navigate('sites', {trigger: true});
			});
		},

		render: function() {
			$('#app-container').addClass('with-background');

			var self = this;

			var button_loginGoogle = {
				label: 'Log in with Google',
				buttonClass: 'btn-primary'
			};

			return (
				<Layout id="login-page">
					<Row id="login-welcome">
						<Column width="12">
							<h1>Welcome to Site Auditor.  Let's start fixing your site.</h1>
							<h2>Enter the first website you want to analyze.</h2>
						</Column>
					</Row>
					<Row>
						<Column width="6" offset="3">
							<Form id="login-form" className="form-inline" onValidate={self.handleValidate} onSubmit={self.handleSubmit}>
								<div className="input-group">
									<Text name="url" type="text" inputmode="url" placeholder="Enter site URL to analyze" />
									<span className="input-group-btn">
										<Button type="submit" options={button_loginGoogle} />
									</span>
								</div>
							</Form>
						</Column>
					</Row>
				</Layout>
			);
		}
	});
});
