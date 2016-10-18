/*eslint-disable */
'use strict';

var breakpoints = (function (parent, $) {

	var MediaQueryListener = function() {
		this.afterElement = window.getComputedStyle ? window.getComputedStyle(document.body, ':after') : false;
		this.currentBreakpoint = '';
		this.lastBreakpoint = '';
		this.init();
	};

	MediaQueryListener.prototype = {

		init: function () {
			var self = this;

			if(!self.afterElement) {
				// If the browser doesn't support window.getComputedStyle just return
				return;
			}

			self._resizeListener();

		},
		_resizeListener: function () {
			var self = this;

			$(window).on('resize orientationchange load', function() {
				// Regexp for removing quotes added by various browsers
                self.currentBreakpoint = self.afterElement.getPropertyValue('content').replace(/^["']|["']$/g, '');

				if (self.currentBreakpoint !== self.lastBreakpoint) {
					$(window).trigger('breakpoint-change', self.currentBreakpoint);
					self.lastBreakpoint = self.currentBreakpoint;
				}

			});
		}

	};

	parent.mediaqueryListener = parent.mediaqueryListener || new MediaQueryListener();

	return parent;

} (breakpoints || {}, jQuery));
