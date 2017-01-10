define([
	'react',
	'underscore',
	'jsx!components/common/link',
	'jsx!components/common/icon'
], function(
	React,
	_,
	Link,
	Icon
) {
	return React.createClass({
		componentWillMount: function() {
			var self = this;
		},

		componentWillUnmount: function() {
			var self = this;
		},

		render: function() {
			var self = this;

			var options = this.props.options;

			var id = _.isString(options.id) ? options.id : '';
			var icon = _.isString(options.icon) ? (<Icon icon={options.icon} />) : '';
			var badge = _.isNumber(options.badge) ? (<span className="badge">{options.badge}</span>) : '';
			var target = _.isString(options.target) ? options.target : '';
			var label = options.label || '';

			var onClick = function() {};

			if (_.isFunction(options.onClick)) {
				onClick = options.onClick;
			}

			var link;

			// if this React element has children, use that for the label instead
			if (typeof this.props.children !== 'undefined') {
				label = this.props.children;
			}

			if (_.isEmpty(options.url)) {
				link = (
					<a id={id} target={target} onClick={onClick} className={this.props.className}>{icon} {label} {badge}</a>
				);
			}
			else {
				link = (
					<a id={id} target={target} href={options.url} onClick={onClick} className={this.props.className}>{icon} {label} {badge}</a>
				);
			}

			return link;
		}
	});
});