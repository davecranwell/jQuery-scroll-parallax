/*!
 * Copyright (c) 2010 Brandon Aaron (http://brandonaaron.net)
 * backgroundPosition cssHook for jquery. Necessary to combat different css property names between browsers
 * https://github.com/brandonaaron/jquery-cssHooks
 * Licensed under the MIT License (LICENSE.txt).
 */
(function($) {
    // backgroundPosition[X,Y] get hooks
    var $div = $('<div style="background-position: 3px 5px">');
    $.support.backgroundPosition   = $div.css('backgroundPosition')  === "3px 5px" ? true : false;
    $.support.backgroundPositionXY = $div.css('backgroundPositionX') === "3px" ? true : false;
    $div = null;

    var xy = ["X","Y"];

    // helper function to parse out the X and Y values from backgroundPosition
    function parseBgPos(bgPos) {
        var parts  = bgPos.split(/\s/),
            values = {
                "X": parts[0],
                "Y": parts[1]
            };
        return values;
    }

    if (!$.support.backgroundPosition && $.support.backgroundPositionXY) {
        $.cssHooks.backgroundPosition = {
            get: function( elem, computed, extra ) {
                return $.map(xy, function( l, i ) {
                    return $.css(elem, "backgroundPosition" + l);
                }).join(" ");
            },
            set: function( elem, value ) {
                $.each(xy, function( i, l ) {
                    var values = parseBgPos(value);
                    elem.style[ "backgroundPosition" + l ] = values[ l ];
                });
            }
        };
    }

    if ($.support.backgroundPosition && !$.support.backgroundPositionXY) {
        $.each(xy, function( i, l ) {
            $.cssHooks[ "backgroundPosition" + l ] = {
                get: function( elem, computed, extra ) {
                    var values = parseBgPos( $.css(elem, "backgroundPosition") );
                    return values[ l ];
                },
                set: function( elem, value ) {
                    var values = parseBgPos( $.css(elem, "backgroundPosition") ),
                        isX = l === "X";
                    elem.style.backgroundPosition = (isX ? value : values[ "X" ]) + " " + 
                                                    (isX ? values[ "Y" ] : value);
                }
            };
            $.fx.step[ "backgroundPosition" + l ] = function( fx ) {
                $.cssHooks[ "backgroundPosition" + l ].set( fx.elem, fx.now + fx.unit );
            };
        });
    }
})(jQuery);

/*!
 * Scroll-based parallax plugin for jQuery
 * Copyright (c) 2011 Dave Cranwell (http://davecranwell.com)
 * Licensed under the MIT License.
 * 2011-05-18
 * version 1.0
 */
(function($){
	$.fn.scrollParallax = function(options) {
		var settings = {
			'speed': 0.2,
			'axis': 'x,y',
			'debug': false,
		}

		function debug(msg){
			if(settings.debug && 'console' in window && 'log' in window.console){
				console.log(msg);
			}
		}
		
		return this.each(function() {
			//defined accessible $this var in standard way for use within functions
			var $this = $(this);
			
			//extend options in standard way
			if (options) {
				$.extend(settings, options);
			}
			
			$this.bind('inview', function (event, visible) {
				if (visible == true) {
					$this.addClass("inview");
					debug("in view");
				}else{
					$this.removeClass("inview");
					debug("out of view");
				}
			});
	
			//find current position so parallax can be relative to it
			var currentPosArray=$this.css("backgroundPosition").split(" ");
			var currentXPos=parseInt(currentPosArray[0].replace(/[^0-9\-]/g, ""));
			var currentYPos=parseInt(currentPosArray[1].replace(/[^0-9\-]/g, ""));
						
			//recalculate position on scroll
			$(window).bind('scroll', function(){
				if($this.hasClass("inview")){			
					var offset = $this.offset();

					//calculate new position
					if(settings.axis.match(/x/)){
						var Xpos = offset.left - $(window).scrollLeft();
						var newXPos = (-(Xpos) * settings.speed) + currentXPos
					}else{
						var newXPos = currentXPos;
					}
					if(settings.axis.match(/y/)){
						var Ypos = offset.top - $(window).scrollTop();
						var newYPos = (-(Ypos) * settings.speed) + currentYPos;
					}else{
						var newYPos = currentYPos;
					}
					
					debug("new X position: "+ newXPos);
					debug("new Y position: "+ newYPos);
					
					$this.css({'backgroundPosition':  parseInt(newXPos) + "px " + parseInt(newYPos) +"px"}); 
				}
			});
		});
	};
	
})(jQuery);