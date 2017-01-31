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
