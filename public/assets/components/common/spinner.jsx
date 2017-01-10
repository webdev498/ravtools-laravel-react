define([
	'react'
], function(
	React
) {
	return React.createClass({
		render: function() {
			var className = 'sk-fading-circle spinner';
			var margin = ((this.props.size/2) * -1) + 'px' || '-15px';

			var dimensions = {
				width: this.props.size || '30px',
				height: this.props.size || '30px',
				marginLeft: margin,
				marginTop: margin
			};

			if (this.props.hasOwnProperty('inline') && this.props.inline === true) {
				delete dimensions.marginLeft;
				delete dimensions.marginTop;

				className += ' inline';
			}

			return (
				<div className={className} style={dimensions}>
					<div className="sk-circle1 sk-circle"></div>
					<div className="sk-circle2 sk-circle"></div>
					<div className="sk-circle3 sk-circle"></div>
					<div className="sk-circle4 sk-circle"></div>
					<div className="sk-circle5 sk-circle"></div>
					<div className="sk-circle6 sk-circle"></div>
					<div className="sk-circle7 sk-circle"></div>
					<div className="sk-circle8 sk-circle"></div>
					<div className="sk-circle9 sk-circle"></div>
					<div className="sk-circle10 sk-circle"></div>
					<div className="sk-circle11 sk-circle"></div>
					<div className="sk-circle12 sk-circle"></div>
				</div>
			);
		}
	});
});