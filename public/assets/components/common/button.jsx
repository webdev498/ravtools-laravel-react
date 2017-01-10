define([
	'react',
	'underscore',
	'tracker',
	'jsx!components/common/icon',
	'jsx!components/common/button'
], function (
	React,
	_,
	Tracker,
	Icon,
	Button
) {
	return React.createClass({
		componentWillMount : function () {
			var self = this;
		},

		componentWillUnmount : function () {
			var self = this;
		},

		handleClick: function(e){
			var self = this;
			if(_.isFunction(self.props.options.onClick)){
				self.props.options.onClick(e);
			}

			if(_.isString(self.props.options.label)){
				Tracker.track('clicked', Tracker.getPage() + (self.props.parent_id ? '.'  + self.props.parent_id: '') + '.button', Tracker.slugify(self.props.options.label));
			}
		},

		render : function () {
			var options = this.props.options;

			var buttonClass = _.isString(options.buttonClass) ? 'btn ' + options.buttonClass : 'btn btn-default';

			var buttonType = _.isString(this.props.type) ? this.props.type : 'button';

			var icon = _.isString(options.icon) ? (<Icon icon={options.icon} />) : '';

			return (
                <button type={buttonType} className={buttonClass} onClick={this.handleClick} role="button">
					{icon} {options.label}
				</button>
			);
		}
	});
});
