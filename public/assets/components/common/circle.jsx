define([
	'react',
	'progressbar',
	'jsx!components/common/circle'
], function(
	React,
	ProgressBar,
	Circle
) {
	return React.createClass({
		componentDidMount: function() {
			this.animateCircle();
		},

		componentDidUpdate: function() {
			this.animateCircle();
		},

		animateCircle: function () {
			var element = React.findDOMNode(this);

			var percent = parseInt(this.props.percent) || 0;
			var duration = (this.props.hasOwnProperty('animate') && this.props.animate === false) ? 1 : 1000;

			var color = '#BF0930'; // red, default
			
			if (percent >= 90) {
				color = '#8CC63F'; // green
			}
			else if (percent >= 80) {
				color = '#F9B300'; // yellow
			}
			else if (percent >= 70) {
				color = '#FF5B07'; // orange
			}

			$(element).empty(); // element is div.progress-circle

			var circle = new ProgressBar.Circle(element, {
				color: color,
				strokeWidth: 10,
				trailColor: '#FFFFFF',
				fill: '#FFFFFF',
				duration: duration,
				text: {
					value: '0',
					style: {
						color: color,
						position: 'absolute',
						left: '50%',
						top: '50%',
						fontSize: this.props.fontSize || '2rem',
						fontWeight: '600',
						padding: 0,
						margin: 0,
						transform: {
							prefix: true,
							value: 'translate(-50%, -50%)'
						}
					}
				},
				step: function(state, bar) {
					bar.setText((bar.value() * 100).toFixed(0));
				}
			});

			circle.animate((percent * .01));
		},

		render: function() {
			return (
				<div className="progress-circle"></div>
			);
		}
	});
});