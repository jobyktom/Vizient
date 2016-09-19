/*
 *   Description: Vizient website
 *   Author: Jayson Hunter, Sean Hawie
 *   Date: October 2015
 *   Version 1.0.0
 */
/*eslint-disable */
'use strict';

var Vizient = (function() {
	var $window = $(window),
		pagePathURL = '',
		hubPageURL = '',
		hubPageURLLessSlash = '',
		$body = $('body'),
		contentScrolledClass = 'content-scrolled',
		contentScrollOffset = 200,
		didScroll,
		lastScrollTop = 0,
		delta = 5,
		$headerBarHeight,
		$primaryNavItems = $('#primary-nav .header-nav__nav-item'),
		$primaryNavLinks = $('#primary-nav .header-nav__nav-link'),
		$mobileNavItems = $('#mobile-nav .mobile-nav__nav-item'),
		$mobileNavLinks = $('#mobile-nav .mobile-nav__nav-link'),
		$postEntries = $('.post-entries'),
		$postEntryList = $('.post__entry'),
		$megaNav = $('.js-mega-nav'),
		megaNavOpenClass = "mega-nav-is-open",
		$megaNavClose = $('.js-mega-nav-close'),
		$megaNavItems = $('.mega-nav__nav-content'),
		megaNavTimeout,
		primaryNavTimeout;

	var init = function init() {
		// Check if we've scrolled the page every 250ms
		setInterval(function() {
			if (didScroll) {
				_hasPageScrolled();
				didScroll = false;
			}
		}, 250);

		// When windows resizes check height of page header and pass
		// it to the function controlling the sticky header
		window.onresize = function() {
			$body.hasClass(contentScrolledClass) && $body.removeClass(contentScrolledClass);

			// setTimeout(function() {
			// 	_equalHeights();
			// }, 100);
		};

		// Initialise the website

		_getPagePaths();
		_setupStickyHeader();
		//_setupPrimaryNav();
		//_setupMegaNav();
		_setupMobileNav();
		_setupActiveMenuItems();
		_setupSectionNav();
		_setupSectionSubNav();
		_setupCarousels();
		_adIE8Class();
		_equalHeights();

		// setTimeout(function() {
		// 	_equalHeights();
		// }, 100);
	};

	// Check if the page has been scrolled, and expand or contract the main header bar
	var _hasPageScrolled = function _hasPageScrolled() {
		var st = $(window).scrollTop();

		// Make sure they scroll more than delta
		if (Math.abs(lastScrollTop - st) <= delta) return;

		// If they scrolled down and are past the navbar
		if (st > lastScrollTop && st > $headerBarHeight) {
			// Scroll Down
			$body.addClass(contentScrolledClass);
		}
		else {
			// Scroll Up
			if (st + $(window).height() < $(document).height()) {
				$body.removeClass(contentScrolledClass);
			}
		}

		lastScrollTop = st;
	};

	// Get an array of the page URL components, and extract the hub and content page text
	// This text is used to add active classes to the menu navs.
	var _getPagePaths = function _getPagePaths() {
		var splitPagePathURL = [];

		// Get the page URL
		pagePathURL = window.location.pathname;
		splitPagePathURL = pagePathURL.split('/');

		hubPageURLLessSlash = splitPagePathURL[splitPagePathURL.length - 1];;
		// Get the name of the the hub page E.g. 'what-we-do'
		hubPageURL = '/' + hubPageURLLessSlash;
	};

	// The sticky header bar
	var _setupStickyHeader = function _setupStickyHeader() {
		$headerBarHeight = $('#header-bar').height();

		// Check if the content has scrolled down by a set amount.
		$window.scroll(function() {
			didScroll = true;
		});
	};

	// // The Primary Nav Controller.
	// // Hovering on menu items shows the relevant Mega Nav section
	// var _setupPrimaryNav = function _setupPrimaryNav() {
	// 	var megaNavOpenClass = "mega-nav-is-open";

	// 	// Control displaying the mega nav on hover of the primary nav items
	// 	$primaryNavLinks.on('mouseover', function(e) {
	// 		var that = this;

	// 		window.clearTimeout(megaNavTimeout);

	// 		// Only show after short delay on hover, and hide on mouseout
	// 		primaryNavTimeout = setTimeout(function(e) {
	// 			$(that).tab('show');
	// 		}, 200);
	// 	}).on('mouseout', function() {
	// 		window.clearTimeout(primaryNavTimeout);
	// 		_setMegaNavTimeout();
	// 	}).on('click', function(e) {
	// 		// On first tap/hover open the mega nav else open the page
	// 		if ($(this).hasClass(megaNavOpenClass)) {
	// 			window.location.href = $(this).attr("data-href");
	// 		}
	// 		else {
	// 			$(this).tab('show');
	// 		}
	// 	});
	// };


	// Control Mobile nav open/closed state
	var _setupMobileNav = function _setupMobileNav() {
		$('.js-mobile-icon').on('click', function() {
			$('#mobile-header').toggleClass('is-open');
			$('#mobileMenu').toggleClass('is-open');
			$('body').toggleClass('mobile-menu-open');
		});

		$('#mobile-nav .has-subnav').on('click', function(e) {
			e.preventDefault();

			if ($(this).hasClass('is-open')) {
				$(this).removeClass('is-open');
				$(this).siblings('ul').slideUp();
			}
			else {
				var $this = $(this);
				$('#mobile-nav .has-subnav').each(function() {
					if ($(this) != $this) {
						$(this).removeClass('is-open');
						$(this).siblings('ul').slideUp();
					}
				});

				$(this).addClass('is-open');
				$(this).siblings('ul').slideDown();
			}
		});
	};

	// Highlight the active menu item both on desktop and mobile menus
	var _setupActiveMenuItems = function _setupActiveMenuItems() {
		var menuActiveClass = 'is-active',
				linkURL = '',
				hubNavItemIndex = 0,
				hubLinkCount = $primaryNavLinks.length,
				$subNavLinks = $('.mobile-nav__sub-nav-link'),
				subNavItemIndex = 0,
				subNavLinkCount = $('.mobile-nav__sub-nav-link').length,
				foundNavItem = false;

		// Highlight the active primary nav menu item
		while (!foundNavItem && hubNavItemIndex < hubLinkCount) {
			// Get the data-href value from the <a> link
			linkURL = $($primaryNavLinks[hubNavItemIndex]).data('href');

			// If the data-href matches the hub URL then make the menu item active
			if (linkURL === hubPageURLLessSlash) {
				foundNavItem = true;

				// Highlight dekstop nav
				$($primaryNavLinks[hubNavItemIndex]).addClass(menuActiveClass);

				// Highlight mobile nav hub item
				$($mobileNavLinks[hubNavItemIndex + 1]).addClass(menuActiveClass);
			}

			hubNavItemIndex++;
		};

		// Highlight mobile sub nav item using the data-href as before
		foundNavItem = false;

		while (!foundNavItem && subNavItemIndex < subNavLinkCount) {
			linkURL = $($subNavLinks[subNavItemIndex]).data('href');

			if (linkURL === hubPageURLLessSlash) {
				foundNavItem = true;

				$($subNavLinks[subNavItemIndex]).addClass(menuActiveClass);
			}

			subNavItemIndex++;
		};
	};

	// The 'in page' section nav controller
	var _setupSectionNav = function _setupSectionNav() {
		$('.section-nav .block-list__list-link').click(function(event) {
			event.preventDefault();
			$('.section-nav .block-list__list-link').removeClass('active');
			$(this).addClass('active');
			$('html, body').animate({
				scrollTop: $($(this).attr('href')).offset().top - 70
			}, 500);
		});
	};

	// The 'in page' section nav controller for main menu nav
	var _setupSectionSubNav = function _setupSectionSubNav() {
		$('.mega-nav__nav-link_module').click(function(event) {
			//event.preventDefault();

			$('html, body').animate({
				scrollTop: $($(this).attr('href').substring($(this).attr('href').indexOf('#'))).offset().top - 70
			}, 500);
		});
	};

	// Enable Carousels
	var _setupCarousels = function _setupCarousels() {
		var carouselDelay = 4000;

		$('.carousel').carousel({
			interval: carouselDelay
		});
	};

	// // Equal Heights LDB -----------------------------------------
	// var _equalHeights = {
	// 	init: function() {
	// 		var selectorMax = '.eq-height-max',
	// 			selectorMin = '.eq-height-min';

	// 		$(window).load(function() {
	// 			_equalHeights.equalize(selectorMax, 'max');
	// 			_equalHeights.equalize(selectorMin, 'min');
	// 		});

	// 		$(window).resize(function() {
	// 			_equalHeights.equalize(selectorMax, 'max');
	// 			_equalHeights.equalize(selectorMin, 'min');
	// 		});
	// 	},

	// 	equalize: function(className, minMax) {
	// 		var currentTallest = 0,
	// 			currentShortest = 0,
	// 			currentRowStart = 0,
	// 			rowDivs = new Array(),
	// 			$el,
	// 			topPosition = 0;

	// 		var selector = className || '.eq-height-max';

	// 		$(selector).each(function() {
	// 			$el = $(this);
	// 			$($el).height('auto');
	// 			topPosition = $el.position().top;

	// 			if (currentRowStart != topPosition) {
	// 				if (minMax == 'min') {
	// 					for (var currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
	// 							rowDivs[currentDiv].height(currentShortest);
	// 					}
	// 				}
	// 				else {
	// 					for (var currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
	// 						rowDivs[currentDiv].height(currentTallest);
	// 					}
	// 				}

	// 				rowDivs.length = 0;
	// 				currentRowStart = topPosition;
	// 				currentShortest = $el.height();
	// 				currentTallest = $el.height();
	// 				rowDivs.push($el);
	// 			}
	// 			else {
	// 				rowDivs.push($el);

	// 				if (minMax == 'min') {
	// 					currentShortest = (currentShortest > $el.height()) ? ($el.height()) : (currentShortest);
	// 				}
	// 				else {
	// 					currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
	// 				}
	// 			}

	// 			for (var currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
	// 				rowDivs[currentDiv].height(currentTallest);
	// 			}
	// 		});
	// 	}
	// };

/*
	Equal heights function
	----------------------
	Elements labelled "equal-heights-md" will only get equalised on desktop.
	Elements labelled "equal-heights-sm" will get equalised on tablet and desktop.
	Elements labelled "equal-heights-mbls" will get equalised from 480px and above.
*/
	
	var _equalHeights = function _equalHeights(itemClassName) {
		var heightClass = itemClassName || '.equal-height-item';
		var w = $(window).width();

		// unset all heights first
		$('.equal-heights-md, .equal-heights-sm, .equal-heights-mbls').find(heightClass).css({
			width: '',
			height: ''
		});

		// < 480px
		if (w < 480) {}

		// 480px - 768px
		else if (480 <= w && w < 768) {
			$('.equal-heights-mbls').each(function() {
				// find the tallest block then make all blocks that height
				var tallestItem = 0;
				$(this).find(heightClass).each(function() {
						if ($(this).height() > tallestItem) tallestItem = $(this).height();
				});
				$(this).find(heightClass).height('').height(tallestItem);
			});
		}

		// 768px - 1024px
		else if (w < 1024) {
			$('.equal-heights-mbls, .equal-heights-sm').each(function() {
				// find the tallest block then make all blocks that height
				var tallestItem = 0;
				$(this).find(heightClass).each(function() {
					if ($(this).height() > tallestItem) tallestItem = $(this).height();
				});
				$(this).find(heightClass).height('').height(tallestItem);
			});
		}

		// > 1024px
		else {
			$('.equal-heights-mbls, .equal-heights-sm, .equal-heights-md').each(function() {
				// find the tallest block then make all blocks that height
				var tallestItem = 0;
				$(this).find(heightClass).each(function() {
					if ($(this).height() > tallestItem) tallestItem = $(this).height();
				});
				$(this).find(heightClass).height('').height(tallestItem);
			});
		}
	};

 

	// Add a .ie8 class for css fixes
	var _adIE8Class = function _adIE8Class() {
		function isIE() {
			var myNav = navigator.userAgent.toLowerCase();
			return myNav.indexOf('msie') != -1 ? parseInt(myNav.split('msie')[1]) : false;
		}

		if (isIE() == 8) {
			// IE8 code
			$('html').addClass('ie8');
		}
		else {
			// Other versions IE or not IE
		}
	};

	//  Only expose these functions to the global scope
	return {
		init: init
	};
})();

var loadMoreSize = $(".blog .post__entry").size();
var loadMoreX = 3;

// On document ready bootstrap the website
$(document).ready(function() {
	Vizient.init();

	//- Load More
	$(".blog .post__entry:lt(" + loadMoreX + ")").addClass('show');

	$(".js-load-more").click(function() {
		loadMoreX = loadMoreX + 3 <= loadMoreSize ? loadMoreX + 3 : loadMoreSize;
		$(".blog .post__entry:lt(" + loadMoreX + ")").not('.show').addClass('show');
		if (loadMoreX == loadMoreSize) {
			$(this).attr('disabled', true);
		}
		return false;
	});

	// override default options (also overrides global overrides)
	$('div.expandable').expander({
		slicePoint: 200, // default is 100
		expandPrefix: ' ', // default is '... '
		expandText: '+ Expand', // default is 'read more' 
		userCollapseText: '- Reduce', // default is 'read less'
		moreClass: 'btn-expand',
		lessClass: 'btn-reduce',
		expandEffect: 'fadeIn'
	});

	//accordion
	$(".accordion-control").click(function(event) {
		event.preventDefault();
		$(this).children('.icon').toggleClass('icon-chevron-up');
		$(this).children('.icon').toggleClass('icon-chevron-down');
		$(this).parent('.item__hdr').siblings('.item__content').slideToggle();
	});

	// open/close in-page nav
	$(".nav-trigger").click(function(event) {
		event.preventDefault();
		$(this).children('.icon').toggleClass('icon-chevron-down');
		$(this).children('.icon').toggleClass('icon-chevron-up');
		$(this).siblings('.section-nav').slideToggle();
	});

	if ($('.nav-special2').length) {
		$('.nav-special2').find('a').first().addClass('active');
	}
});
//# sourceMappingURL=main.js.map