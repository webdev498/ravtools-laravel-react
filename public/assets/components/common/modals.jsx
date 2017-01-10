define([
	'react',
	'underscore',
	'jsx!components/common/modals'
], function(
	React,
	_,
	Modals
) {
	return React.createClass({
		buildModals: function() {
			var self = this;

			var modals = [];
			if (_.isArray(this.props.modals)) {
				modals = self.props.modals.map(function(modal, i) {
					return new React.cloneElement(modal, {
						key: 'modal-' + i
					});
				});
			}

			return modals;
		},

		render: function() {
			var modals = this.buildModals();

			return (
				<div id="modals">
					{modals}
				</div>
			);
		}
	});
});