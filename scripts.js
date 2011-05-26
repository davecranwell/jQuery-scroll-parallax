$(function(){
	/* main background image. moves against the direction of scroll*/
	$('.item').scrollParallax({
		'speed': -0.2
	});

	/* inner items, moves slightly faster than the background */
	$('.item .inner').scrollParallax({
		'speed': -0.5
	});
	
	/* two additional samples inside item2, both moving with direction of scroll*/
	$('.item .inner-lev1').scrollParallax({
		'speed': 0.2
	});	
	$('.item .inner-lev2').scrollParallax({
		'speed': 0.5
	});
});