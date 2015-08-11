var limit = 'а б в г д е ж з и к л м н о п р с т у ф х ц ч ш'.toUpperCase();
var letters = [], rand = [], checking = [], status = 0, counter = 0, answer, color, right = 0, wrong = 0, startTime, stopTime, time;
letters = limit.split(' ');

//Проверка
$('#input').keypress(function(event) {
	if (event.which == 13 && $('#input').val()) {
		$('#input').hide();
		$('#counter').hide();
		$('td').remove();
		answer = $('#input').val().toUpperCase().replace(/ /g, '').replace(/\,/g, '').replace(/\./g, '*').replace(/\?/g, '*');
		checkLetters(answer);
		stopTime = Date.now();
		time = stopTime - startTime;
		$('#time').text(sec2min(time));
		$('#mistakes').show();
		$('#time').show();
		$('#button').show();
	}
});

$('body').ready(function() {
	reset();
    $('body').bind('keydown',function(e) {
        if (e.keyCode == 32 && (status == 0 || status == 1)) {
        	if (status == 0) {
        		startTime = Date.now();
        		start();
        	}
        	counter++;
        	showLetter();
        	status = 1;
        }
        else if (e.keyCode == 13 && status == 1) {
        	$('#display').hide();
        	$('#input').show().focus();
        	status = 2;
        }
	});
});

//Функции
function sec2min(time) {
	time = (time/1000).toFixed();
	minutes = Math.floor((time/60));
	var seconds;
	if (time%60 < 10 && minutes > 0) seconds = '0' + time%60;
	if (minutes > 0) return minutes + ':' + time%60;
	else return time%60 + ' сек';
}

function getRandomLetter() {
	if (rand.length == 0) {
		rand = letters.slice();
		rand.sort(function () {
      		return Math.random() - 0.5;
		});
	}
	var temp = rand.pop();
	checking.push(temp);
	return temp;
}

function start() {
	$('#counter').show();
	$('#display').show();
}

function reset() {
	$('#instruction').show();
	$('#time').hide();
	$('#counter').hide();
	$('#results').hide();
	$('#button').hide();
	$('#mistakes').hide();
	$('td').remove();
	status = 0, wrong = 0, right = 0, rand = [], checking = [], counter = 0;
}

function showLetter() {
	$('#display').text(getRandomLetter());
	$('#counter').text(counter);
	$('#start').hide();
	$('#instruction').hide();
}

function checkLetters(answer) {
	for(var i=0; i<checking.length; i++) {
		var temp = '*';
		if (answer[i]) temp = answer[i];
		if (checking[i] == temp) {
			color = "green";
			right++;
		}
		else {
			color = "red";
			wrong++;
		}
		$('#right').append('<td>' + checking[i] + '</td>');
		$('#answer').append('<td>' + temp + '</td>')
		$('#answer').find('td:last').addClass(color);
	}
	$('#results').show();
	$('#mistakes').text('Ошибок: ' + wrong);
	$('#input').val('');
}