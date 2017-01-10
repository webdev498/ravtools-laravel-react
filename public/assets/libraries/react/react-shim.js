// this works, but doesn't work unless you RequireJS both 'react' and 'react-shim'
define(['react'], function (React) {
	"use strict";

	window.React = React;
});
