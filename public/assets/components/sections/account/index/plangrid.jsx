define([
	'react',
	'event',
	'underscore',
	'jsx!components/sections/account/index/plangrid',
	'jsx!components/sections/account/index/planbox',
	'jsx!components/common/row',
	'jsx!components/common/column'
], function(
	React,
	Event,
	_,
	PlanGrid,
	PlanBox,
	Row,
	Column
) {
	return React.createClass({
		buildBoxes: function() {
			var boxes = [];

			var plan = this.props.plan || null;
			var action = this.props.action || 'upgrade';

			if (_.isNull(plan)) {
				return null;
			}

			var planType = plan.type;

			var plans = ['free', 'grow', 'pro'];
			var planIndex = plans.indexOf(planType);

			_.each(plans, function(item, i) {
				var key = _.uniqueId('plan-');

				// Upgrade Options
				if (action === 'upgrade') {
					// Only show PlanBoxes for Plans better than the Current One
					if (planIndex <= i) {
						if (planType === item) {
							boxes.push( (<PlanBox key={key} type={item} active={true} />) );
						}
						else {
							boxes.push( (<PlanBox key={key} type={item} action="upgrade" />) );
						}
					}
					// Empty Column to center the Boxes (1/2 of a Full Box (4) to account for both sides)
					else {
						boxes.push( (<Column key={key} width="2" />) );
					}
				}

				// Downgrade Options
				else {
					if (planIndex >= i) {
						if (planType === item) {
							boxes.push( (<PlanBox key={key} type={item} active={true} action="keep" />) );
						}
						else {
							boxes.push( (<PlanBox key={key} type={item} action="downgrade" />) );
						}
					}
					// Empty Column to center the Boxes (1/2 of a Full Box (4) to account for both sides)
					else {
						boxes.unshift((<Column key={key} width="2" />));
					}
				}
			});

			return boxes;
		},

		render: function() {
			var boxes = this.buildBoxes();

			return (
				<Row className="account-plans-grid">
					{boxes}
				</Row>
			);
		}
	});
});