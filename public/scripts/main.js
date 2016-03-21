$(window).scroll(function() {
	clearTimeout($.data(this, 'scrollTimer'));
	$.data(this, 'scrollTimer', setTimeout(function() {
		// do something
		isScrolledIntoView();
	}, 250));
});
 
function isScrolledIntoView() {
	$('.fail iframe').each(function(){
		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + $(window).height();

		var elemTop = $(this).offset().top;
		var elemBottom = elemTop + $(this).height();

		if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
			// if ($(this).attr('src').indexOf('&autoplay=1') === -1) {
			// 	$(this).attr('src', ($(this).attr('src') + "&autoplay=1"));
			// }
		} else {
			// if ($(this).attr('src').indexOf('&autoplay=1') > -1) {
			// 	$(this).attr('src', ($(this).attr('src').replace('&autoplay=1', '')));
			// }
		}
	});
}