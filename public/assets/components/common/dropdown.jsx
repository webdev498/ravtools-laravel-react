define([
	'react',
	'underscore',
	'tracker',
	'jsx!components/common/dropdown',
	'jsx!components/common/link',
	'jsx!components/common/icon'
], function(
	React,
	_,
	Tracker,
	DropDown,
	Link,
	Icon
) {
	return React.createClass({
		componentDidMount: function() {
			var self = this,
				node = this.getDOMNode();

			// Reference for events: http://getbootstrap.com/javascript/#dropdowns
			if (_.isFunction(self.props.options.onOpen)) {
				$(node).on('show.bs.dropdown', self.props.options.onOpen);
			}

			if (_.isFunction(self.props.options.onClose)) {
				$(node).on('hide.bs.dropdown', self.props.options.onClose);
			}
		},

		componentWillUnmount: function() {
			var self = this,
				node = this.getDOMNode();

			$(node).off('show.bs.dropdown').off('hide.bs.dropdown');
		},

		handleClick: function () {
			var self = this;

			if (_.isFunction(self.props.options.onOpen)) {
				self.props.options.onOpen();
			}

			// Track what we can here
			if(self.props.className || self.props.id){
				Tracker.track('clicked', Tracker.getPage() + '.dropdown', self.props.className || self.props.id);
			}
		},

		render: function() {
			var self = this,
				links = self.props.links,
				options = self.props.options,
				id = this.props.id,
				list_items;

			if (_.isArray(links) && !_.isEmpty(links)) {
				list_items = links.map(function (link, i) {
					var key = id + '_' + i;
					var item;

					switch (link.type) {
						case 'header':
							item = (
								<li key={key} className="dropdown-header">{link.label}</li>
								);
							break;
						case 'separator':
							item = (
								<li key={key} role="separator" className="dropdown-divider divider"></li>
								);
							break;
						case 'link':
							var active = link.active === true ? 'dropdown-link active' : 'dropdown-link';

							item = (
								<li key={key} className={active}>
									<Link options={link} />
								</li>
								);
							break;
						case 'object':
							item = (
								<li key={key}>{link.html}</li>
							);
							
							break;
					}

					return item;
				});
			}

			var icon = _.isString(options.icon) ? (<Icon icon={options.icon} />) : '';
			var caret = options.showCaret === true ? (<span className="caret"></span>) : '';
			var badge = _.isNumber(options.badge) ? (<span className="badge">{options.badge}</span>) : '';
			var dropdown_menu_class = options.alignRight === true ? 'dropdown-menu dropdown-menu-right' : 'dropdown-menu';

			var dropdown_link = (
				<span onClick={self.handleClick}>{icon} {options.label} {caret} {badge}</span>
			);

			var dropdown;
			var dropdownClass;
			if (options.listItem === true) {
				dropdownClass = this.props.className ? ('dropdown ' + this.props.className) : 'dropdown';

				dropdown = (
					<li id={id} className={dropdownClass}>
						<a className="dropdown-toggle" data-toggle="dropdown" role="button">
							{dropdown_link}
						</a>
						<ul className={dropdown_menu_class}>
							{list_items}
						</ul>
					</li>
				);
			}
			else {
				dropdownClass = this.props.className ? ('dropdown btn-group ' + this.props.className) : 'dropdown btn-group';

				var buttonClass = _.isString(options.buttonClass) ? ('btn ' + options.buttonClass) : 'btn btn-default';
				buttonClass += ' dropdown-toggle';

				dropdown = (
					<div id={id} className={dropdownClass}>
						<a className={buttonClass} data-toggle="dropdown" role="button">
							{dropdown_link}
						</a>
						<ul className={dropdown_menu_class}>
							{list_items}
						</ul>
					</div>
				);
			}

			return dropdown;
		}
	});
});