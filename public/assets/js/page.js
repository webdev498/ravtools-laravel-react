define([
	'react',
	'event',
	'js/page'
], function (React, Event, Page) {
	Page = {};

	Page.load = function (page, options) {
		requirejs([page], function(Page) {
			if (!_.isObject(options)) {
				options = {};
			}

			$('#app-container').removeClass('with-background');
			
			Event.fire('app.router.updated', {
				page: React.createElement(Page, options)
			});
		});
	};

	return Page;
});