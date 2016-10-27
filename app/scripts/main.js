/*
 *   Description: Vizient website
 *   Author: Jayson Hunter, Sean Hawie. Expanded/modified: Rob Bradley.
 *   Date: October 2016
 *   Version 3.0.0
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
 
		};

		// Initialise the website

		//_getPagePaths();
		_setupStickyHeader(); 
		_setupDashboardNav();
		_setupMobileNav();
		_setupActiveMenuItems();
		_setupSectionNav();
		_setupSectionSubNav();
		_setupCarousels();
		_setupSearchBar();
    
		//_adIE8Class();
		
		//_equalHeights();
 
		_toggleClearTextControl();
		_clearText();
		_toggleRegion();
		_checkAllCheckboxes();
		_contentLoader();
		_clearFilters();

		// Responsive JavaScript Components
		$(window).on('breakpoint-change', function(e, breakpoint) {

			_dashboardCarousel(breakpoint);

			_dashboardTabs(breakpoint);

			_filterPanels(breakpoint);

		});

		// When windows resizes check height of page header and pass
		// it to the function controlling the sticky header
		window.onresize = function() {				 
			setTimeout(function() {
				_equalHeights();
			}, 100);
		};

		// Initialise the website
		_equalHeights();
		
		setTimeout(function() {
			_equalHeights();
		}, 100);
 
	};

	// Load More buttons 
	var _contentLoader = function _contentLoader() {

		// Check component exists
		if ( $('.js-content-loader').length ) {

			// Each content loader check how many items to display
			$('.js-content-loader').each(function(){
				var showItems = $(this).data('showItems');
				$(this).find('.module:lt(' + showItems + ')').show();
			});

			$('.js-content-loader-trigger').on('click', function(e) {
				e.preventDefault();
				
				// Get components and ensure we use ones
				// associated with this instance based on id and button href
				// pairing
				var $contentLoaderTrigger = $(this),
					id = $contentLoaderTrigger.attr('href'),
					$contentRegion = $(id),
					$hiddenContent = $contentRegion.find('.module:hidden');

				// Fade in new row and update the list of hidden rows
				$hiddenContent.first().fadeIn();
				$hiddenContent = $contentRegion.find('.module:hidden');

				// Once no more hidden rows remove button
				if (!$hiddenContent.length) {
					$contentLoaderTrigger.hide();
				}
			});
		}
	};

	// Show / Hide toggle 
	var _toggleRegion = function _toggleRegion() {
		$('.js-toggle-trigger').on('click',function() {
			var $toggleTrigger = $(this),
				$toggleRegion = $toggleTrigger.closest('.js-toggle-region'),
				$toggleContent = $toggleRegion.find('.js-toggle-content');

			$toggleRegion.toggleClass('js-toggle-visible');
			$toggleContent.toggleClass('hide');
		});
	};

	// Responsive Filter Panel states
	var _filterPanels = function _filterPanels(breakpoint) {

		var $filterPanels = $('.js-filter-panels'),
			$toggleContent = $filterPanels.find('.js-toggle-content');

		// Check component exists
		if ( $filterPanels.length ) {
			
			// Determine behaviour
			if (breakpoint == 'bp-medium' || breakpoint == 'bp-large') {

				$filterPanels.addClass('js-toggle-visible')
				$toggleContent.removeClass('hide');

			} else {

				$filterPanels.removeClass('js-toggle-visible')
				$toggleContent.addClass('hide');
			}
		}

	};

	var _checkAllCheckboxes = function _checkAllCheckboxes() {
		$('.js-check-all').on('click', function(e) {
			e.preventDefault();
			var $checkboxGroup = $(this).parents('.js-checkbox-group'),
				$checkBoxes = $checkboxGroup.find('input:checkbox');

			$checkBoxes.prop('checked', !$checkBoxes.prop('checked'));
		});
	};

	var _clearFilters = function _clearFilters() {
		$('.js-clear-filters').on('click', function(e) {
			e.preventDefault();
			var $filterPanels = $(this).parents('.js-filter-panels'),
				$checkBoxes = $filterPanels.find('.js-checkbox-group input:checkbox'),
				$selectBoxes = $filterPanels.find('.js-select-box');

			$checkBoxes.prop('checked', false);
			$selectBoxes.find('option:disabled').prop('selected', true);
		});
	};

	var _toggleClearTextControl = function _toggleClearTextControl() {
		$('.js-search-input').on('input',function() {
			var $searchInput = $(this),
				$clearText = $searchInput.parent().find('.js-clear-text');

			if ( $searchInput.val() != '') {
				$clearText.removeClass('hide');
			} else {
				$clearText.addClass('hide');
			}
		});
	};

	var _clearText = function _clearText() {
		$('.js-clear-text').on('click', function() {
			var $clearText = $(this),
				$searchInput = $clearText.parent().find('.js-search-input');

			$searchInput.val('');
			$clearText.addClass('hide')
		});
	};

	// Responsive Dashboard Carousel
	var _dashboardCarousel = function _dashboardCarousel(breakpoint) {

		var $dashboardCarousel = $('.carousel-dashboard');

		// Check component exists
		if ( $dashboardCarousel.length ) {

			// Determine behaviour
			// - Only allow carousel to operate at largest breakpoint
			// - Otherwise hack 'destroy' of it, in absence of proper method in Bootstrap.
			if (breakpoint == 'bp-large') {

				$dashboardCarousel.carousel();

			} else {

				$dashboardCarousel.carousel('pause').carousel(0);
  			
  				$dashboardCarousel.off('bs.carousel.data-api'); 
	
			}

		}

	};

	// Responsive Dashboard Tabs
	var _dashboardTabs = function _dashboardTabs(breakpoint) {

		var $dashboardTabs = $('.tabs-dashboard'),
			headerHeight = $('#mobile-header').outerHeight();

		// Check component exists
		if ( $dashboardTabs.length ) {

			// Determine behaviour
			// - Add scrolling to content behaviour to tabs only at x-small viewport
			// where the tabs are stacked vertically.
			if (breakpoint == 'bp-x-small') {

				$dashboardTabs.find('.tab a').on('click', function(){
					$('html, body').animate({
        				scrollTop: $('.tab-content').offset().top - headerHeight
    				}, 800);
				});

			} else {

				$dashboardTabs.find('.tab a').off();
			}
		}

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

	// Next two functions could be refined and made into one later
	// Perhaps setupAccordionNav to be less specific to their
	// context.
	
	// Control Dashboard nav open/closed state
	var _setupDashboardNav = function _setupDashboardNav() {
		$('.js-accordion-nav-trigger').on('click', function() {
			$(this).toggleClass('is-open');
			$('#dashboard-side-nav').toggleClass('is-open');
		});
		$('#dashboard-side-nav .has-subnav').on('click', function(e) {
			e.preventDefault();

			if ($(this).hasClass('is-open')) {
				$(this).removeClass('is-open');
				$(this).siblings('ul').slideUp();
			}
			else {
				var $this = $(this);
				$('#dashboard-side-nav .has-subnav').each(function() {
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
	Elements labelled "row-eq-height-md" will only get equalised on desktop.
	Elements labelled "row-eq-height-sm" will get equalised on tablet and desktop.
	Elements labelled "row-eq-height-mbls" will get equalised from 480px and above.
	*/ 
	var _equalHeights = function _equalHeights(itemClassName) {

	var heightClass = itemClassName || '.eq-height';
	var w = $(window).width();


	if($('html').hasClass('ie9')){

		// unset all heights first
		$('.row-eq-height-md, .row-eq-height-sm, .row-eq-height-mbls').find(heightClass).css({ width: '', height: '' });

		// < 480px
		if (w < 480) {}

		// 480px - 768px
		else if (480 <= w && w < 768) {

			$('.row-eq-height-mbls').each(function () {

			  // find the tallest block then make all blocks that height
			  var tallestItem = 0;
			  $(this).find(heightClass).each(function () {
				if ($(this).height() > tallestItem) tallestItem = $(this).height();
			  });
			  $(this).find(heightClass).height('').height(tallestItem);
			});

			 
		  } else if (w < 768) {

			  $('.row-eq-height-mbls, .row-eq-height-sm').each(function () {

				// find the tallest block then make all blocks that height
				var tallestItem = 0;
				$(this).find(heightClass).each(function () {
				  if ($(this).height() > tallestItem) tallestItem = $(this).height();
				});
				$(this).find(heightClass).height('').height(tallestItem);
			  });

			   
			} else {

				$('.row-eq-height-mbls, .row-eq-height-sm, .row-eq-height-md').each(function () {

				  // find the tallest block then make all blocks that height
				  var tallestItem = 0;
				  $(this).find(heightClass).each(function () {
					if ($(this).height() > tallestItem) tallestItem = $(this).height();
				  });
				  $(this).find(heightClass).height('').height(tallestItem);
				});
			  }
		};

		// end eq heights
	};



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

	// The 'in page' section nav controller
	var _setupSearchBar = function _setupSearchBar() {
		$('#mobileMenu').find('.typeahead-input').attr('placeholder', 'Search for a solution');

		$('.search').click(function(event) {
			event.preventDefault();
			
			if ($(this).find('i').hasClass('icon-search')) {
				$(this).find('i').removeClass('icon-search').addClass('icon-close');
			} else {
				$(this).find('i').addClass('icon-search').removeClass('icon-close');
			}

			$('.search-bar').toggleClass('is-active');
		});

		$('.typeahead-input').typeahead({
				source: ['Suppliers', 'Suppliers search number one', 'Suppliers search number two', 'Suppliers search number three']
    });
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
	// if the main element has the class 'showSubNav' then show the 
	// sub nav menu and add a padding of 60px to the section to avoid the 
	// overlapping if not reverse the action
	if($('main').hasClass('showSubNav')){
		$('.subnav').show();
		$('section.banner').addClass('pt-60');
	}else{
		$('.subnav').hide();
		$('section.banner').removeClass('pt-60');
	}
	// 
	// $('#header-bar .primary-nav a').click(function() {
	//   	$('body').toggleClass('subnav-active');
	//   	$('.subnav').slideToggle("fast", function() {

	//   	});
	// });

	$('#header-bar #dashboard-menu').click(function() {
		// $('.logged-in').toggleClass('logged-in-active');
		// $('.dashboard-nav').slideToggle("fast", function() {

		// });
	});

	$(document).click(function (event) {

		var clickover = $(event.target);
		// if clicked on the logged-in menu 
		if ( (clickover.is("a#dashboard-menu")) || (clickover.is("span.username")) ){
			$('.logged-in').toggleClass('logged-in-active');
			$('.dashboard-nav').slideToggle("fast", function() {
				// $(".icon-chevron-down-small").css({'transform' : 'rotate(180deg)'});
			});
			if($('.logged-in').hasClass('logged-in-active')){
				$(".icon-chevron-down-small").css({'transform' : 'rotate(180deg)'});
			}else{
				$(".icon-chevron-down-small").css({'transform' : 'rotate(0deg)'});
			}   	
		}else{ // if clicked on outside logged-in menu 
			if($('.logged-in').hasClass('logged-in-active')){
					$('.logged-in').removeClass('logged-in-active')
					$('.dashboard-nav').slideToggle("fast", function() {
						$(".icon-chevron-down-small").css({'transform' : 'rotate(0deg)'});
					});
			}
		}

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
	//accordion - start
	function toggleChevron(e) {
	    $(e.target)
	        .prev('.panel-heading')
	        .find("i.indicator")
	        .toggleClass('glyphicon-chevron-up glyphicon-chevron-down');
	}

	$('#accordion').on('hidden.bs.collapse', toggleChevron);
	$('#accordion').on('shown.bs.collapse', toggleChevron);
	//accordion - end 

	//accordion -old start
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