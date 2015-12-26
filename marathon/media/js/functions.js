//Из 9:45 в 9
function hoursFromHHMM(hhmm) {
	return parseInt(hhmm.split(':')[0]);
}
//Из 9:45 в 45
function minutesFromHHMM(hhmm) {
	return parseInt(hhmm.split(':')[1]);
}

//Загружаем настройки из куки
function openPreferences() {
	$('#start-time').text($.cookie('start-time'));
	$('#duration-time').text($.cookie('duration-time'));
	$('#cubes-solved').text($.cookie('cubes-solved'));
	$('#pref-scramble').text($.cookie('pref-scramble'));
	$('#pref-orientation').text($.cookie('pref-orientation'));
}

//Сохраняем настройки в куки
function savePreferences() {
	$.cookie('start-time', $('#start-time').text());
	$.cookie('duration-time', $('#duration-time').text());
	$.cookie('cubes-solved', $('#cubes-solved').text());
	$.cookie('pref-scramble', $('#pref-scramble').text());
	$.cookie('pref-orientation', $('#pref-orientation').text());
}
//Секунды в 0:23:34
function secondsToHuman(seconds) {
	sec = seconds % 60;
	min = Math.floor((seconds/60)%60);
	hour = Math.floor((seconds/3600)%60);
	out=""+hour;
	out+=":";
	out+=((min<10)?"0":"")+min;
	out+=":";
	out+=((sec<10)?"0":"")+sec;
	return out;
}
//83.24 в 1:23.24
function ssmmtoHuman(milli) {
	ms = Math.floor((milli%1)*100);
	sec = Math.floor(milli%60);
	min = Math.floor((milli/60)%60);
	out = '';
	if (min > 0)
		out += min + ':';
	out += ((sec<10 && min > 0)?'0':'') + sec + '.';
	out += ((ms<10)?'0':'') + ms;
	return out;
}

//83.24 в 1:23
function ssmmtommss(milli) {
	sec = Math.floor(milli%60);
	min = Math.floor((milli/60)%60);
	out = '';
	if (min > 0)
		out += min + ':';
	out += ((sec<10 && min > 0)?'0':'') + sec;
	return out;
}

//Если нажат пробел или тач. Главное действие.
function showImage() {
	$('#scramble').text(getscramble());
	$('#solved').text(++counter);
	$('#appr').text(ssmmtoHuman(seconds/counter));
	$.cookie('cubes-solved', $('#solved').text());
	lastSolve = Date.now() - lastStart;
	lastStart = Date.now();
	$('#last-solve').text(ssmmtoHuman(lastSolve/1000));
	clock = 0;
	$('#current-time').text(0);
}

//Переключаю на вкладку Настройки
function selectTabPref() {
	openPreferences();
	$('#marathon-view').hide();
	$('#preferences-view').show();
	$('#error').hide();
}
function selectTabMarathon() {
	trigger = true;
	savePreferences();
	counter = $.cookie('cubes-solved');
	now = new Date;
	startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hoursFromHHMM($.cookie('start-time')), minutesFromHHMM($.cookie('start-time')), 0, 0);
	duration = $.cookie('duration-time') * 60 * 60;
	seconds = Math.floor((now - startTime)/1000);
	$('#solved').text(counter);
	$('#appr').text(ssmmtoHuman(seconds/counter));
	$('#preferences-view').hide();
	$('#marathon-view').show();
	$('#bottom').show();
	$('#error').hide();
}

function stopwatch() {
	$('#current-time').text(ssmmtoHuman((Date.now() - lastStart)/1000));
}

function timing() {
	if (seconds > 0) {
		$('#from-start').text(secondsToHuman(seconds));
		$('#to-end').text('-' + secondsToHuman(duration-seconds));
	}
	else if (seconds == 0) {
		lastStart = Date.now();
		$('#marathon-view').show();
		$('#error').hide();
		$('#appr').text('-');
		$('#last-solve').text('-');
		trigger = true;
	}
	else if (seconds < 0) {
		trigger = false;
		$('#marathon-view').hide();
		$('#error').html("-" + secondsToHuman(seconds*-1));
		$('#error').show();	
		lastStart = Date.now();
	}
	if (seconds >= duration) { 
		seconds = duration - 1;
		$('#appr').text(ssmmtoHuman(duration/counter));
		$('#bottom').hide();
		$('#error').text('Марафон завершён!').show();
		trigger = false;
	}
    seconds += 1;
} 