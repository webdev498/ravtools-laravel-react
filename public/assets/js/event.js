define([
	'jquery',
	'underscore'
], function($, _) {
	var Event = {};

	Event.events = [];

	Event.debug = false;

	Event.add = function(event, func) {
		if (Event.debug) {
			console.log('[Events] Event.add called: event' , event, 'func', func);
		}

		var hash = Event.getHash(event, func);

		if (_.indexOf(Event.events, hash) > -1) {
			if (Event.debug) {
				console.warn('[Events] Identical Event exists: ' + event);
			}
		}
		else {
			Event.events.push(hash);
			document.addEventListener(event, func);
		}
	};

	Event.remove = function(event, func) {
		if (Event.debug) {
			console.log('[Events] Event.remove called: event', event, 'func', func);
		}

		var hash = Event.getHash(event, func);
		var index = _.indexOf(Event.events, hash);

		if (index > -1) {
			Event.events.splice(index, 1);
			document.removeEventListener(event, func);
		}
		else {
			if (Event.debug) {
				console.warn('[Events] Event does not exist: ' + event);
			}
		}
	};

	Event.fire = function(event, detail) {
		if(Event.debug) {
			console.log('[Events] Event.fire called: event', event, 'detail', detail);
		}

		if (typeof detail == undefined) {
			detail = {};
		}

		var exists = false;
		_.each(Event.events, function(customEvent) {
			var index = customEvent.indexOf(event);

			if (index > -1) {
				exists = true;
			}
		});

		if (exists == true) {
			document.dispatchEvent(new CustomEvent(event, {
				detail: detail
			}));
		}
		else {
			if (Event.debug) {
				console.warn('[Events] No Listeners for: ' + event);
			}
		}
	};

	Event.getEvents = function(debug) {
		if (Event.debug == true || debug == true) {
			console.info('[Events] Active Listeners', Event.events);
		}

		return Event.events;
	};

	Event.getHash = function(event, func) {
		return event + ',' + Event.convertCode(func);
	};

	Event.convertCode = function(func) {
		var funcStr = func.toString();
		var funcRes = funcStr.replace(/\s/gi, '');

		var hash = 0, i, chr, len;
		if (funcRes.length === 0) return hash;
		for (i = 0, len = funcRes.length; i < len; i++) {
			chr   = funcRes.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	};

	return Event;
});