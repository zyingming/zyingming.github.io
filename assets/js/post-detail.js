$(function() {
	var init = function() {
		var upperLimit = 100;

		var scrollElem = $('.top-link-wrapper');
		scrollElem.hide();

		$(window).on('scroll', function() {
			var scrollTop = $(document).scrollTop();
			if ( scrollTop > upperLimit ) {
	      		$(scrollElem).stop().fadeTo(300, 1);           
	    	}else{       
	      		$(scrollElem).stop().fadeTo(300, 0); 
	    	}
		})
		$('#topLink').click(function(){
	    	$('html, body').animate({scrollTop:0}, 500); return false;
	  	});
	}
	init();
})