/*eslint-disable */
'use strict';

$(document).ready(function() {

    $(window).on('resize', function(event) {
        var parentWidth = $("#nav-bar-filter").parent().width() - 40;
        var ulWidth = $("#more-nav").outerWidth();
        var menuLi = $("#nav-bar-filter > li");
        var liForMoving = [];
        var activeElement = $(document.activeElement)[0];

        // before remove item check if you have to reset the focus
        var removeOriginal = function(item, clone) {
            // check focused element
            if (item.find('a')[0] === activeElement) {
                activeElement = clone.find('a')[0];
            }

            item.remove();
        };

        //take all elements that can't fit parent width to array
        menuLi.each(function() {
            var $el = $(this);
            ulWidth += $el.outerWidth();
            if (ulWidth > parentWidth) {
                liForMoving.unshift($el);
            }
        });

        if (liForMoving.length > 0) { //if have any in array -> move em to "more" ul
            event.preventDefault();

            liForMoving.forEach(function(item) {
                var clone = item.clone();
                clone.prependTo(".subfilter");

                removeOriginal(item, clone);
            });

        } else if (ulWidth < parentWidth) { //check if we can put some 'li' back to menu
            liForMoving = [];

            var moved = $(".subfilter > li");
            for (var i = 0, j = moved.length; i < j; i++) {
                var movedItem = $(moved[i]);

                var tmpLi = movedItem.clone();
                tmpLi.appendTo($("#nav-bar-filter"));


                ulWidth += movedItem.outerWidth();
                if (ulWidth < parentWidth) {
                    removeOriginal(movedItem, tmpLi);
                } else {
                    // dont move back
                    ulWidth -= movedItem.outerWidth();
                    tmpLi.remove();
                }

            }
        }
        if ($(".subfilter > li").length > 0) { //if we have elements in extended menu - show it
            $("#more-nav").show();
        } else {
            // check if 'more' link has focus then set focus to last item in list
            if ($('#more-nav').find('a')[0] === $(document.activeElement)[0]) {
                activeElement = $("#nav-bar-filter > li:last-child a")[0];
            }

            $("#more-nav").hide();
        }

        // reset focus
        activeElement.focus();
    });

    $("#more-nav > li > a").on('click', function(event) {
        event.preventDefault();
        $("ul.subfilter").slideToggle("fast", function() {
            $("#more-nav > li > a").toggleClass("is-open");
        });
    });


    $(window).trigger("resize"); //call resize handler to build menu right
});