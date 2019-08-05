//centerBox 
$(document).ready(function(){
centerHeight()
	function centerHeight(){
		windowHeight = $(window).height();
		centerBoxHeight = $('#rdgCenter').height();
		$('#rdgCenter').css('margin-top',(windowHeight-centerBoxHeight)/2+'px')
		centerBoxHeights = $('#im').height();
		$('#im').css('top',(windowHeight-centerBoxHeights)/2+'px')
                               }	
	$(window).resize(function(){centerHeight()});
        
	});
//boxResize

	var layout1 = $('#layout_01,#layout_02,#layout_03,#centerBox,.scene1_layout_box,#endBox,#layout_04,#layout_05,#layout_06,.me1-bg,#me1pic-bg,#me2pic-bg,.me1msg');
		function windWH(){
			var windowHeight = $(window).height();
			    windowWidth = $(window).width();
			layout1.css('height',windowHeight+'px');
			$('.maskNav').css('height',windowHeight-56+'px')
			if(windowHeight