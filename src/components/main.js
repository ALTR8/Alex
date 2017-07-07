(function($){


    $('#fullpage').fullpage({
		menu: '#menu',
		anchors:['Alexandra', 'Developer', 'Powerlifting', 'Opera'],
		afterLoad: function(anchorLink, index){
            if (index == 1){
                // $("footer").fadeIn(250);
                // $('header').removeClass('dark-header');
                $('.wrap-1').addClass('animated infinite bounce2');
            }
        },
        onLeave: function(index, nextIndex, direction){
    		var leavingSection = $(this);

    		if(index == 1 && direction =='down'){
    			$("footer").fadeOut(100);
                $('.vm-wrap-2').addClass('animated fadeInDown');
                $('.vm-wrap-1').removeClass('animated fadeInDown');
                $('.svg-wrap').removeClass('animated infinite bounce2 fadeInDown');
                $('header').removeClass('animated fadeInDown');
                $('footer').removeClass('animated fadeInDown');
    		}

            if(index == 1 && nextIndex == 3 && direction =='down'){
                $('header').addClass('dark-header');
                $('.vm-wrap-3').addClass('animated fadeInDown');
                $('.vm-wrap-1').removeClass('animated fadeInDown');
                $('.vm-wrap-2').removeClass('animated fadeInDown');
                $('.svg-wrap').removeClass('animated infinite bounce2');
            }

    		if(index == 2 && direction =='down'){
    			$('header').addClass('dark-header');
                $('.vm-wrap-3').addClass('animated fadeInDown');
                $('.vm-wrap-2').removeClass('animated fadeInDown');
    		}

            if(index ==2 && direction=="up"){
                $('.vm-wrap-1').addClass('animated fadeInDown');
                $('.vm-wrap-2').removeClass('animated fadeInDown');
                $('.svg-wrap').addClass('animated infinite bounce2');
            }

            if(index == 3 && direction == 'up') {
                $('header').removeClass('dark-header');
                $('.vm-wrap-2').addClass('animated fadeInDown');
                $('.vm-wrap-3').removeClass('animated fadeInDown');
            }

            if(index == 3 && nextIndex == 1 && direction =='up'){
                $('header').removeClass('dark-header');
                $('.vm-wrap-1').addClass('animated fadeInDown');
                $('.vm-wrap-2').removeClass('animated fadeInDown');
                $('.vm-wrap-3').removeClass('animated fadeInDown');
                $('.svg-wrap').addClass('animated infinite bounce2');
            }
    	}
	});

})(window.jQuery || {});
