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
			'debug': false
		}

		function debug(msg){
			if(settings.debug && 'console' in window && 'log' in window.console){
				console.log(msg);
			}
		}
		
		return this.each(function() {
			//defined accessible $this var in standard way for use within functions
			var $this = $(this),
				//timestamp,last position for the interval & FPS ~= 30
                ts,FPS = 34,lastPos = {x:0,y:0},intervalActive,            
            	//find current position so parallax can be relative to it
                currentPosArray=$this.css("backgroundPosition").split(" "),
                currentXPos=parseInt(currentPosArray[0].replace(/[^0-9\-]/g, "")),
                currentYPos=parseInt(currentPosArray[1].replace(/[^0-9\-]/g, ""));
            
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
			
            function updateElemPos(){
				var newXPos,newYPos,
                    offset = $this.offset();

                //calculate new position
                newXPos = (settings.axis.match(/x/))?
                    parseInt((-(offset.left - $(window).scrollLeft()) * settings.speed) + currentXPos) + "px":
                    currentPosArray[0];
                
                newYPos = (settings.axis.match(/y/))?
                    parseInt((-(offset.top - $(window).scrollTop()) * settings.speed) + currentYPos) + "px":
                    currentPosArray[1];
                
                if(typeof intervalActive == 'undefined'){
                    lastPos.x = newXPos;
                    lastPos.y = newYPos;
                }
                
                intervalActive = true;
                
                debug("new X position: "+ newXPos);
                debug("new Y position: "+ newYPos);
                
                if((newXPos !== lastPos.x) || (newYPos !== lastPos.y)){
                    $this.css({'backgroundPosition':  newXPos + " " + newYPos});
                    lastPos.x = newXPos;
                    lastPos.y = newYPos;
                }else{
                    clearInterval(ts);
                    intervalActive = false;
                    $(window).bind('scroll.parallax',onScroll);
                }
			}
            
            function onScroll(){
                if($this.hasClass("inview")){
                    if(!intervalActive){	
                        ts = setInterval(updateElemPos,FPS);
                        $(window).unbind('scroll.parallax');
                    }
                }
            }
            
			//recalculate position on scroll
			$(window).bind('scroll.parallax',onScroll);
		});
	};
	
})(jQuery);