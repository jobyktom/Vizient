$().ready(function () {	
			
				//we reconstruct menu on window.resize
				$(window).on("resize", function (e) {													
					var parentWidth = $("#nav-bar-filter").parent().width() - 40;
					var ulWidth = $("#more-nav").outerWidth(); 					
					var menuLi = $("#nav-bar-filter > li");					
					var liForMoving = new Array();		
					//take all elements that can't fit parent width to array
					menuLi.each(function () {						
						ulWidth += $(this).outerWidth(); 
						if (ulWidth > parentWidth) {
							liForMoving.push($(this));
						}
					});							
					if (liForMoving.length > 0) {	//if have any in array -> move em to "more" ul
						e.preventDefault();						
						liForMoving.forEach(function (item) {
							item.clone().appendTo(".subfilter");
							item.remove();
						});							
					}
					else if (ulWidth < parentWidth) { //check if we can put some 'li' back to menu
						liForMoving = new Array();
						var moved = $(".subfilter > li");
						for (var i = moved.length - 1; i >= 0; i--) { //reverse order
							var tmpLi = $(moved[i]).clone();
							tmpLi.appendTo($("#nav-bar-filter"));
							ulWidth += $(moved[i]).outerWidth();
							if (ulWidth < parentWidth) {								
								$(moved[i]).remove();
							}
							else {
								ulWidth -= $(moved[i]).outerWidth();
								tmpLi.remove();
							}							
						}						
					}						
					if ($(".subfilter > li").length > 0) { //if we have elements in extended menu - show it
						$("#more-nav").show();
					}
					else {
						$("#more-nav").hide();
					}
				});
				
				$(window).trigger("resize"); //call resize handler to build menu right
			});