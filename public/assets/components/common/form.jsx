define([
	'react',
	'underscore',
	'jquery',
	'validate',
	'jsx!components/common/form'
], function (
	React,
	_,
	$,
	validate,
	Form
) {
	return React.createClass({
		gather: function() {
			var component = React.findDOMNode(this);

			return validate.collectFormValues(component);
		},

		reset: function() {
			var component = React.findDOMNode(this),
				form = $(component);

			$(form).find('.has-error').removeClass('has-error');
			$(form).find('.help-block').empty();

			form[0].reset();
		},

		notify: function(errors) {
			var component = React.findDOMNode(this),
				form = $(component);

			_.each(errors, function(error, input) {
				var group = $(form).find('#' + input + '-group');

				if (group) {
					var errorString = error.join(', ');

					$(group).addClass('has-error');
					$(group).find('.help-block').html(errorString);
				}
			});

			$(form).find('.form-group.has-error .form-control')[0].select();
			$(form).find('.form-group.has-error .form-control')[0].focus();
		},

		submit: function(event) {
			event.preventDefault();

			var inputs = this.gather();

			if (this.props.hasOwnProperty('preValidate') && _.isFunction(this.props.preValidate)) {
				inputs = this.props.preValidate(inputs);
			}

			if (this.props.hasOwnProperty('onValidate') && _.isFunction(this.props.onValidate)) {
				var errors = this.props.onValidate(inputs);

				if (_.isObject(errors) && !_.isEmpty(errors)) {
					this.notify(errors);

					return;
				}
			}

			if (this.props.hasOwnProperty('postValidate') && _.isFunction(this.props.postValidate)) {
				inputs = this.props.postValidate(inputs);
			}

			if (this.props.hasOwnProperty('onSubmit') && _.isFunction(this.props.onSubmit)) {
				this.props.onSubmit(inputs);
				this.reset();
			}
		},

		render : function () {
			return (
				<form id={this.props.id || _.uniqueId('form-')} className={this.props.className} onSubmit={this.submit} noValidate={true}>
					{this.props.children}
				</form>
			);
		}
	});
});
