define([
	'react',
	'underscore',
	'tracker',
	'jsx!components/common/modal',
	'jsx!components/common/button',
	'jsx!components/common/icon'
], function (
	React,
	_,
	Tracker,
	Modal,
	Button,
	Icon
) {
	return React.createClass({

		componentDidMount : function(){
			var self = this,
				modal = React.findDOMNode(this);

			// Modal is controlled via hide and show jquery events
			// let bind to those
			$(modal).on('shown.bs.modal', function(e){
				Tracker.track('viewed', Tracker.getPage() + '.modal', self.props.id);
			});
		},

		hideModal: function () {
			var modal = React.findDOMNode(this);

			if (this.props.hasOwnProperty('onHide') && _.isFunction(this.props.onHide)) {
				this.props.onHide(modal);
			}
			else {
				$(modal).modal('hide');
			}
		},

		render : function () {
			var self = this,
				buttons = [],
				errors = [];

			if (_.isArray(self.props.buttons)) {
				buttons = self.props.buttons.map(function (options, i) {
					var key = _.uniqueId('modal_button_');

					return (
						<Button parent_id={self.props.id} key={key} options={options} />
					);
				});
			}

			if (_.isArray(self.props.errors)) {
				errors = self.props.errors.map(function (error, i) {
					return (
						<div className="alert alert-danger fade in" role="alert" key={error}>{error}</div>
					);
				});
			}

			return (
				<div id={self.props.id} className="modal fade" tabIndex="-1" role="dialog" aria-labelledby="modal_label" aria-hidden="true">
					<div className="modal-dialog">
						<div className="modal-content">
							<a className="modal-close" onClick={self.hideModal}></a>
							<div className="modal-header">
								<h3 className="modal-title">{self.props.title}</h3>
							</div>
							<div className="modal-body">
								{errors}
								
								{self.props.children}
							</div>
							<div className="modal-footer">
								<div className="btn-toolbar">
									{buttons}
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
	});
});
