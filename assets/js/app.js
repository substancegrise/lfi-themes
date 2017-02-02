$(window).on('hashchange', function() {
    if (window.location.hash) {
        var page = window.location.hash.replace('#', '');
        if (page == Number.NaN || page <= 0) {
            return false;
        } else {
            getPosts(page);
        }
    }
});

$(document).ready(function() {
	// Offset for Main Navigation
	$('#mainNav').affix({
	    offset: {
	        top: 100
	    }
	});
	
	if($("body.formation-single .share-icon").length){		  
		new ShareButton({ui: {flyout:"bottom right",buttonText:""}, networks: {reddit: {enabled:false},linkedin: {enabled:false},whatsapp: {enabled:false},pinterest: {enabled:false},email: {enabled:false}}});
	}
	if($("body.formations .share-icon").length){
		new ShareButton({
			ui : {
				flyout : "middle left",
				buttonText : ""
			},
			networks : {
				facebook:{
					before: function(element) {
						this.url = element.getAttribute("data-url");
					}
				},
				twitter:{
					before: function(element) {
						this.url = element.getAttribute("data-url");
					}
				},
				googlePlus:{
					before: function(element) {
						this.url = element.getAttribute("data-url");
					}
				},
				reddit : {
					enabled : false
				},
				linkedin : {
					enabled : false
				},
				whatsapp : {
					enabled : false
				},
				pinterest : {
					enabled : false
				},
				email : {
					enabled : false
				}
			}
		});
	}

	if($(".full-actus .share-icon").length){		  
		new ShareButton({ui: {flyout:"middle right",buttonText:""}, networks: {reddit: {enabled:false},linkedin: {enabled:false},whatsapp: {enabled:false},pinterest: {enabled:false},email: {enabled:false}}});
	}
	
	if($(".list-item .share-icon").length){
		new ShareButton({
			ui : {
				flyout : "middle right",
				buttonText : ""
			},
			networks : {
				facebook:{
					before: function(element) {
						this.url = element.getAttribute("data-url");
					}
				},
				twitter:{
					before: function(element) {
						this.url = element.getAttribute("data-url");
					}
				},
				googlePlus:{
					before: function(element) {
						this.url = element.getAttribute("data-url");
					}
				},
				reddit : {
					enabled : false
				},
				linkedin : {
					enabled : false
				},
				whatsapp : {
					enabled : false
				},
				pinterest : {
					enabled : false
				},
				email : {
					enabled : false
				}
			}
		}); 
	}
	
	
	$('.nav-button').click(function(e){
		
		$('.nav-button.active').removeClass('active');
		
		var selectedClass =  "";
		if($(this).hasClass("prequalification")){
			selectedClass = "prequalification";
		}
		if($(this).hasClass("competence")){
			selectedClass = "competence";
		}
		if($(this).hasClass("habilitation")){
			selectedClass = "habilitation";
		}
		if($(this).hasClass("certification")){
			selectedClass = "certification";
		}
		if($(this).hasClass("acquis")){
			selectedClass = "acquis";
		}
		
		if($(this).hasClass("all")){ //reset
			selectedClass = "acquis";
			$('.row-list').removeClass('hide');
		}
		else{
			$('.list-formations .row-list').addClass('hide');
			$('.list-formations .row-list.'+selectedClass).removeClass('hide');
			$('.nav-button.'+selectedClass).addClass('active');
		}
	});

	var currentPage = $('.actus.pagination').data('currentPage')/1;
	var lastPage = $('.actus.pagination').data('lastPage')/1;
	
	$('.actus.pagination .next').click(function(e){
		if($('#posts-list-'+(currentPage+1)).length || (currentPage+1) > lastPage){
			if(lastPage >= currentPage+1){
				displaySlideAndMenu(currentPage+1, true);
				currentPage = currentPage+1;
			}
			return false;
		}
		else{
			displaySlideAndMenu(currentPage+1, false);
			$.oc.stripeLoadIndicator.show(e);
			$.request('onPaginate', {success:function(data){addActusSlide(data);}, data: {page: currentPage + 1}});
			currentPage = currentPage+1;
		}
	});
	$('.actus.pagination .prev').click(function(e){
		if($('#posts-list-'+(currentPage-1)).length || currentPage-1 == 0){
			if(currentPage-1 > 0){
				displaySlideAndMenu(currentPage-1, true);
				currentPage = currentPage-1;
			}
			return false;
		}
		else{
			displaySlideAndMenu(currentPage-1, false);
			$.oc.stripeLoadIndicator.show(e);
			$.request('onPaginate', {success:function(data){addActusSlide(data);}, data: {page: currentPage - 1}});
			currentPage = currentPage-1;
		}
	});
	
	$('.actus.pagination .bullet a').click(function(e){
		var thispage = eval('({'+$(this).data('requestData')+'})');
		if($('#posts-list-'+(thispage.page)).length || $(this).hasClass('active')){
			if(!$(this).hasClass('active')){
				displaySlideAndMenu(thispage.page, true);
				currentPage = thispage.page/1;
			}
			return false;
		}
		else{
			displaySlideAndMenu(thispage.page, false);
			$.oc.stripeLoadIndicator.show(e);
			$.request('onPaginate', {success:function(data){addActusSlide(data);}, data: {page: thispage.page}});
			currentPage = thispage.page/1;
		}
	});
	
	
	/************* VIDEO PLAYER ***************/
	var vie = (function(){
		
		var ua = window.navigator.userAgent;
		
		var msie = ua.indexOf('MSIE ');
		if (msie > 0) {
		    // IE 10 or older => return version number
		    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}
		
		var trident = ua.indexOf('Trident/');
		if (trident > 0) {
		    // IE 11 => return version number
		    var rv = ua.indexOf('rv:');
		    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}
		
		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
		   // IE 12 => return version number
		   return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		    }
	
	}());
	
	var exitFullScreenHandler = function(){
		if(!$("body").hasClass("playerfullscreen"))
			$("body").addClass("playerfullscreen")
		else{
			$("body").removeClass("playerfullscreen");
			$("#bgvid")[0].pause();
			$("#bgvid").fadeOut("slow");
		}
	};
	var exitFullScreenMobileHandler = function(){
		if($("#bgvid").length > 0){
			if(!$("body").hasClass("playerfullscreen")){
				$("body").addClass("playerfullscreen")
			} else {
				$("body").removeClass("playerfullscreen");
				$("#bgvid")[0].pause();
				$("#bgvid").fadeOut("slow");
			}
		}
	};
		
	var playVideoFullScreenMobile = function(video) {
		if (document.addEventListener)
		{
		    document.addEventListener('webkitfullscreenchange', exitFullScreenMobileHandler, false);
		    document.addEventListener('mozfullscreenchange', exitFullScreenMobileHandler, false);
		    document.addEventListener('fullscreenchange', exitFullScreenMobileHandler, false);
		    document.addEventListener('MSFullscreenChange', exitFullScreenMobileHandler, false);
		    
		    video.addEventListener('webkitendfullscreen', function(){
		    		$("#bgvid")[0].pause();
					$("#bgvid").fadeOut("slow");
		    	}, false);
		}
				
		var el = video, rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen || el.webkitEnterFullScreen ;
		if(typeof rfs!="undefined" && rfs){
		  rfs.call(el);
		} else {
			alert("La video ne peux pas être vue sur ce navigateur");
		}
	};
	
	 var playVideoFullScreen = function(video) {
		
		if (document.addEventListener){
		    document.addEventListener('webkitfullscreenchange', exitFullScreenHandler, false);
		    document.addEventListener('mozfullscreenchange', exitFullScreenHandler, false);
		    document.addEventListener('fullscreenchange', exitFullScreenHandler, false);
		    document.addEventListener('MSFullscreenChange', exitFullScreenHandler, false);
		}
	
		var el = video, rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen || el.webkitEnterFullScreen ;
		if(typeof rfs!="undefined" && rfs){
		  rfs.call(el);
		} else {
			alert("La video ne peux pas être vue sur ce navigateur");
		}
	
		video.play();
	};

	var vid = document.getElementById("bgvid");
	
	$(".teaser").click(function(){
		playVideoFullScreen($(vid)[0]);							
		return false;
	});
});

function displaySlideAndMenu(page, displayslide) {
	$('.actus.pagination .bullet').removeClass('active');
	$('.actus.pagination .bullet-'+(page)).addClass('active');
	if(displayslide){
		$('.list-actus').addClass("hide");
		$('#posts-list-'+(page)).removeClass('hide');
	}
}

function addActusSlide(data) {
	var page = "";
	$('.list-actus').addClass("hide");
	$('#posts-list-'+(data.page-1)).after(data.content);
	$.oc.stripeLoadIndicator.hide();
}