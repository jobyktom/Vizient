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
		//_equalHeights();

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

	/*
    Equal heights function
    ----------------------
    Elements labelled "equal-heights-md" will only get equalised on desktop.
    Elements labelled "equal-heights-sm" will get equalised on tablet and desktop.
    Elements labelled "equal-heights-mbls" will get equalised from 480px and above.
	*/
	// var _equalHeights = function _equalHeights(itemClassName) {

	// var heightClass = itemClassName || '.equal-height-item';
	// var w = $(window).width();

	// // unset all heights first
	// $('.row-eq-height-md, .row-eq-height-sm, .row-eq-height-mbls').find(heightClass).css({ width: '', height: '' });

	// // < 480px
	// if (w < 480) {}

	// // 480px - 768px
	// else if (480 <= w && w < 768) {

	//     $('.row-eq-height-mbls').each(function () {

	//       // find the tallest block then make all blocks that height
	//       var tallestItem = 0;
	//       $(this).find(heightClass).each(function () {
	//         if ($(this).height() > tallestItem) tallestItem = $(this).height();
	//       });
	//       $(this).find(heightClass).height('').height(tallestItem);
	//     });

	     
	//   } else if (w < 768) {

	//       $('.row-eq-height-mbls, .row-eq-height-sm').each(function () {

	//         // find the tallest block then make all blocks that height
	//         var tallestItem = 0;
	//         $(this).find(heightClass).each(function () {
	//           if ($(this).height() > tallestItem) tallestItem = $(this).height();
	//         });
	//         $(this).find(heightClass).height('').height(tallestItem);
	//       });

	       
	//     } else {

	//         $('.row-eq-height-mbls, .row-eq-height-sm, .row-eq-height-md').each(function () {

	//           // find the tallest block then make all blocks that height
	//           var tallestItem = 0;
	//           $(this).find(heightClass).each(function () {
	//             if ($(this).height() > tallestItem) tallestItem = $(this).height();
	//           });
	//           $(this).find(heightClass).height('').height(tallestItem);
	//         });
	//       }
	// };

	// end eq heights

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

  // RICH: Enable Animated Charts
  var _setupAnimatedCharts = function _setupAnimatedCharts() {
    
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

	// hide subnav
	//$('.subnav').hide();

	// 
	$('#header-bar .primary-nav a').click(function() {
	  	$('body').toggleClass('subnav-active');
	  	$('.subnav').slideToggle("fast", function() {

	  	});
	});

	$('#header-bar #dashboard-menu').click(function() {
	  	$('.logged-in').toggleClass('logged-in-active');
	  	$('.dashboard-nav').slideToggle("fast", function() {

	  	});
	});

 
	//- Hide all rows except first and last for cta
 
	$('.cn03__v7 .row').slice(1, -1).hide();

	//- Load More trigger - then hide when clicked
	$("#cn03__v7__cta").click(function(e) {
		e.preventDefault();
		$('.cn03__v7 .row').slice(1, -1).show();
		$(this).hide();
	});



	$(".toggle-ab").click(function(e) {
		e.preventDefault();
		$('body').toggleClass('accessibility');
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

  // Animated charts
  // Need to trigger this only when element is already visible in viewport on load, or is scrolled
  // into after load viewport.
  // Also need to review if any options set here should be moved into data attributes instead.
  if ( $('.chart').length ) {

    $('.chart').each(function(){
      
      var chartSize = $(this).data('size'),
          chartLineWidth = $(this).data('lineWidth');

      $(this).easyPieChart({
        barColor: '#FFC02E',
        lineCap: 'butt',
        lineWidth: chartLineWidth,
        scaleLength: 0,
        size: chartSize,
        trackColor: '#565EAA'
      });

    });
  }
});
//# sourceMappingURL=main.js.map