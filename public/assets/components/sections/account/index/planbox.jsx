define([
	'react',
	'event',
	'underscore',
	'jsx!components/sections/account/index/planbox',
	'jsx!components/common/column',
	'jsx!components/common/button'
], function(
	React,
	Event,
	_,
	PlanBox,
	Column,
	Button
) {
	return React.createClass({
		getInitialState: function() {
			return {
				type: this.props.type || 'free'
			}
		},

		handleUpgrade: function() {
			Event.fire('account.upgrade', {
				plan: this.state.type
			});
		},

		handleDowngrade: function() {
			Event.fire('account.downgrade_modal.hide');

			Event.fire('account.downgrade', {
				plan: this.state.type
			});
		},

		buildBox: function() {
			var self = this;

			var type = self.state.type;

			var options = {
				type: type
			};

			switch(type) {
				case 'pro':
					options.name = "Pro";
					options.price = 97;
					options.details = "Unlimited Sites\n100,000 pages/mo\nPurchase additional pages as needed";
					break;
				case 'grow':
					options.name = "Grow";
					options.price = 27;
					options.details = "1 Site\n10,000 pages per month";
					break;
				case 'free':
				default:
					options.name = "Free";
					options.price = 0;
					options.details = "1 Site\n20 pages per month";
					break;
			}

			options.heading = null;
			options.button = null;

			if (self.props.hasOwnProperty('button') && _.isObject(self.props.button)) {
				options.heading = self.props.heading;
				options.button = self.props.button;
			}
			else if (self.props.hasOwnProperty('action') && _.isString(self.props.action)) {
				var action = self.props.action;

				switch(action) {
					case 'keep':
						options.heading = 'Current Plan';
						options.button = {
							label: 'Keep',
							buttonClass: 'btn-primary',
							onClick: function() {
								Event.fire('account.downgrade_modal.hide');
							}
						};
						break;
					case 'upgrade':
						options.heading = 'Upgrade To';
						options.button = {
							label: 'Upgrade',
							buttonClass: 'btn-primary',
							onClick: function() {
								self.handleUpgrade();
							}
						};
						break;
					case 'downgrade':
						options.button = {
							label: 'Downgrade',
							buttonClass: 'btn-primary',
							onClick: function() {
								self.handleDowngrade();
							}
						};
						break;
				}
			}

			if (self.props.hasOwnProperty('active') && self.props.active == true) {
				options.heading = 'Current Plan';
			}

			return options;
		},

		render: function() {
			var options = this.buildBox();

			var className = "account-plan plan-" + options.type;
			if (this.props.hasOwnProperty('active') && this.props.active == true) {
				className += " active";
			}

			var button = null;
			if (_.isObject(options.button)) {
				button = (
					<div className="btn-toolbar">
						<Button options={options.button} />
					</div>
				);
			}

			return (
				<Column className={className} width="4">
					<div className="heading">{options.heading || (<span>&nbsp;</span>)}</div>
					<div className="details">
						<p className="top">
							<span className="price"><span className="value">${options.price}</span>{options.type != 'free' ? 'per month' : ''}</span>
							<span className="name pull-right"><strong>{options.name}</strong></span>
						</p>
						{options.details.split("\n").map(function(item) {
							var key = _.uniqueId('detail-');

							return (
								<p key={key}>
									{item}
								</p>
							);
						})}
						{button}
					</div>
				</Column>
			);
		}
	});
});
