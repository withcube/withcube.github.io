$('#start-time').editable();
$('#duration-time').editable();
$('#cubes-solved').editable();

if (typeof $.cookie('start-time') === 'undefined') {
	$.cookie('start-time', '10:00');
	$.cookie('duration-time', '3');
	$.cookie('cubes-solved', '0');
	$.cookie('pref-scramble', 'Показывать');
	$.cookie('pref-orientation', 'Менять');
}

//Инициализация
trigger = true;
clockId = setInterval(stopwatch, 10);
lastStart = Date.now();
lastSolve = 0;
counter = $.cookie('cubes-solved');
now = new Date;
startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hoursFromHHMM($.cookie('start-time')), minutesFromHHMM($.cookie('start-time')), 0, 0);
duration = parseFloat($.cookie('duration-time')) * 60 * 60;
seconds = Math.floor((now - startTime)/1000);
timing();
$('#solved').text(counter);
$('#appr').text(ssmmtoHuman(seconds/counter));
$('#scramble').text(getscramble());
openPreferences();

$('.menu a').click(function(event) {
	event.preventDefault();
	$('.menu a').removeClass('active');
	$(this).addClass('active');
	if ($(this).attr('id') == 'marathon') {
		selectTabMarathon();
	}
	else {
		selectTabPref();
	}
}); 

if ($('#pref-scramble').text() == 'Показывать')
	$('#pref-scramble').css('color', 'green');
else $('#pref-scramble').css('color', 'red');

if ($('#pref-orientation').text() == 'Менять')
	$('#pref-orientation').css('color', 'green');
else $('#pref-orientation').css('color', 'red');

//Самодельный toggle
$('#pref-scramble').click(function() {
	if ($(this).text() == 'Показывать') {
		$(this).text("Не показывать").css('color', 'red');
	}
	else 
		$(this).text("Показывать").css('color', 'green');;	
	savePreferences();
});

$('#pref-orientation').click(function() {
	if ($(this).text() == 'Менять') {
		$(this).text("Не менять").css('color', 'red');
	}
	else 
		$(this).text("Менять").css('color', 'green');	
	savePreferences();
});

$(document).bind('keydown',function(e) {
    key  = e.keyCode;
    if (key == 32 && trigger) showImage();
});

setInterval('timing();',1000);