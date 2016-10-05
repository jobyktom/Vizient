/* IE 9 equal height cols for flexbox fallback
 */
/*eslint-disable */

var Vizient = (function() {

	var init = function init() {
		 
		if(document.body.className === 'ie9') {
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
 

	//  Only expose these functions to the global scope
	return {
		init: init
	};
})();
 
// On document ready bootstrap the website
$(document).ready(function() {
	Vizient.init();  

});
//# sourceMappingURL=ie9-eq.js.map