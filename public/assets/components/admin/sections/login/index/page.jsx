define([
	'react',
	'underscore',
	'jquery',
	'auth',
	'event',
	'request',
	'jsx!components/admin/sections/login/index/page',
	'jsx!components/admin/layouts/page',
	'jsx!components/common/column',
	'jsx!components/common/row',
	'jsx!components/common/form',
	'jsx!components/common/button',
	'jsx!components/common/text'
], function(
	React,
	_,
	$,
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
		handleSubmit: function(inputs) {
			Auth.handleLogin(function() {
				Router.navigate('accounts', {trigger: true});
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
							<h1>Admin</h1>
						</Column>
					</Row>
					<Row>
						<Column width="12">
							<Form id="admin-login-form" onSubmit={self.handleSubmit}>
								<Button type="submit" options={button_loginGoogle} />
							</Form>
						</Column>
					</Row>
				</Layout>
			);
		}
	});
});