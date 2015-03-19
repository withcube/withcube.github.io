var algs 	= {
	'cll' 		: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40], 
	'eg1' 		: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
	'eg2' 		: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
	'ortega' 	: [1,2,3,4,5,6,7,8,9,10,11],
	'6stickers'	: [1,2,3,4,5,6],
	'f2l' 		: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41],
	'oll' 		: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228],
	'pll' 		: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
	'coll'		: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41, 42, 43],
	'wv' 		: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27],
	'ols' 		: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216],
	'bld' 		: ['А','Б','В','Г','Д','Е','Ж','З','И','К','Л','М','Н','О','П','Р','С','Т','У','Ф','Х','Ц','Ч','Ш'],
	'ibld'		: ['В_edge', 'Г_edge', 'А_edge', 'Б_edge', 'О_edge', 'П_edge', 'Р_edge', 'С_edge', 'И_edge', 'М_edge', 'Л_edge', 'К_edge', 'У_edge', 'Ц_edge', 'Х_edge', 'Ф_edge', 'Е_edge', 'Т_edge', 'Ж_edge', 'З_edge', 'Ю_edge', 'Я_edge', 'Ш_edge', 'Н_edge', 'Г_corner', 'А_corner', 'Б_corner', 'В_corner', 'П_corner', 'Р_corner', 'С_corner', 'О_corner', 'И_corner', 'М_corner', 'Л_corner', 'К_corner', 'У_corner', 'Ц_corner', 'Х_corner', 'Ф_corner', 'Н_corner', 'Ж_corner', 'З_corner', 'Е_corner', 'Я_corner', 'Ш_corner', 'Т_corner', 'Ю_corner'],//, 'А_corner', 'Б_corner', 'В_corner', 'Г_corner', 'Д_corner', 'Е_corner', 'Ж_corner', 'З_corner', 'И_corner', 'К_corner', 'Л_corner', 'М_corner', 'Н_corner', 'О_corner', 'П_corner', 'Р_corner', 'С_corner', 'Т_corner', 'У_corner', 'Ф_corner', 'Х_corner', 'Ц_corner', 'Ч_corner', 'Ш_corner'],
	'la'		: ['y1ubr', 'o1ubr', 'b1ubr', 'o1ufl', 'y1ufl', 'b1ufl', 'y1dfr', 'o1dfr', 'b1dfr', 'y2ubr', 'g2ubr', 'o2ubr', 'g2ufl', 'y2ufl', 'o2ufl', 'y2dfr', 'g2dfr', 'o2dfr', 'y3ubr', 'r3ubr', 'g3ubr', 'r3ufl', 'y3ufl', 'g3ufl', 'y3dfr', 'r3dfr', 'g3dfr', 'y4ubr', 'b4ubr', 'r4ubr', 'b4ufl', 'y4ufl', 'r4ufl', 'y4dfr', 'b4dfr', 'r4dfr', 'w5ubr', 'b5ubr', 'o5ubr', 'b5ufl', 'w5ufl', 'o5ufl', 'w5dfr', 'b5dfr', 'o5dfr', 'w6ubr', 'o6ubr', 'g6ubr', 'o6ufl', 'w6ufl', 'g6ufl', 'w6dfr', 'o6dfr', 'g6dfr', 'w7ubr', 'g7ubr', 'r7ubr', 'g7ufl', 'w7ufl', 'r7ufl', 'w7dfr', 'g7dfr', 'r7dfr', 'w8ubr', 'r8ubr', 'b8ubr', 'r8ufl', 'w8ufl', 'b8ufl', 'w8dfr', 'r8dfr', 'b8dfr'],
	'ipll'		: ['H(1)', 'H(2)', 'H(3)', 'H(4)', 'U1(1)', 'U1(2)', 'U1(3)', 'U1(4)', 'U2(1)', 'U2(2)', 'U2(3)', 'U2(4)', 'Z(1)', 'Z(2)', 'Z(3)', 'Z(4)', 'A1(1)', 'A1(2)', 'A1(3)', 'A1(4)', 'A2(1)', 'A2(2)', 'A2(3)', 'A2(4)', 'E(1)', 'E(2)', 'E(3)', 'E(4)', 'F(1)', 'F(2)', 'F(3)', 'F(4)', 'G1(1)', 'G1(2)', 'G1(3)', 'G1(4)', 'G2(1)', 'G2(2)', 'G2(3)', 'G2(4)', 'G3(1)', 'G3(2)', 'G3(3)', 'G3(4)', 'G4(1)', 'G4(2)', 'G4(3)', 'G4(4)', 'J1(1)', 'J1(2)', 'J1(3)', 'J1(4)', 'J2(1)', 'J2(2)', 'J2(3)', 'J2(4)', 'N1(1)', 'N1(2)', 'N1(3)', 'N1(4)', 'N2(1)', 'N2(2)', 'N2(3)', 'N2(4)', 'R1(1)', 'R1(2)', 'R1(3)', 'R1(4)', 'R2(1)', 'R2(2)', 'R2(3)', 'R2(4)', 'T(1)', 'T(2)', 'T(3)', 'T(4)', 'V(1)', 'V(2)', 'V(3)', 'V(4)', 'Y(1)', 'Y(2)', 'Y(3)', 'Y(4)']
};

var autoplay = {
    49: [1500, '(1.5 sec)'],
    50: [2000, '(2 sec)'],
    51: [3000, '(3 sec)'],
    52: [4000, '(4 sec)'],
    53: [5000, '(5 sec)'],
};

var answer, image, trainingtype, repeatInterval;
var counter	= 0;
var right	= 0;
var mistake = {};
var dir 	= 'media/images/';
//default settings
var images = [];
var rand = [];
var test = [];

//Случайный элемент массива
function getRandomNumber() {
	if (rand.length == 0) {
		rand = images.slice();
		rand.sort(function () {
      		return Math.random() - 0.5;
		});
	}
	var temp = rand.pop();
	test.push(temp);
	return temp;
}

function showMessage(text) {
	$('#error').text(text);
	$('#error').show();
    setTimeout(function(){$('#error').fadeOut('fast')},2000);
}

$('body').ready(function() {
    $(document).bind('keydown',function(e) {
        key  = e.keyCode;
        if (trainingtype == 'la') checkLA(key);
        else if (trainingtype == 'ipll') checkPLL(key);
        else if (trainingtype == 'ibld') checkBLD(key);
        else if (key == 32) showImage();
        else if (autoplay[key]) {
            clearInterval(repeatInterval);
            repeatInterval = setInterval(showImage, autoplay[key][0]);
            showMessage('Autoplay ' + autoplay[key][1]);
        }
        else if (key == 48) {
        	clearInterval(repeatInterval);
        	showMessage('Autoplay OFF');
        }
});

$('a').click(function(event) {
	event.preventDefault();
	setTrainingType($(this).attr('id'));
	$(this).addClass('active');
}); 

function checkLA(key) {
	if (counter == algs[trainingtype].length+1) {
		showMistakes();
		return;
	}
	var keys = {89:'y', 87:'w', 66:'b', 71:'g', 79:'o', 82:'r'};
	if(keys[key] != null) {
		answer = keys[key];
		if (answer == image[0]) right++;
		else mistake.push(image);
		showImage();
	}
}

function checkPLL(key) {
	if (counter == algs[trainingtype].length+1) {
		showMistakes();
		return;
	}
	var keys = {82:'R',84:'T',89:'Y',85:'U',65:'A',70:'F',71:'G',72:'H',90:'Z',86:'V',78:'N',69:'E',74:'J'};
	if(keys[key] != null) {
		answer = keys[key];
		if (answer == image[0]) {
			right++;
			$('#error').text('');
		}
		else {
			mistake.push([image, answer]);
			$('#error').text('Это был ' + image[0] + '-perm!');
		}
		showImage();
	}
}

function checkBLD(key) {
	if (counter == algs[trainingtype].length+1) {
		showMistakes();
		return;
	}
	var keys = {190:'Ю', 90:'Я',222:'Э',77:'M',83:'S',70:'А',188:'Б',68:"В",85:"Г",76:"Д",84:"Е",186:"Ж",80:"З",66:"И",82:"К",75:"Л",86:"М",89:"Н",74:"О",71:"П",72:"Р",67:"С",78:"Т",69:"У",65:"Ф",219:"Х",87:"Ц",88:"Ч",73:"Ш"};
	answer = keys[key];
	if(keys[key] != null) {
		if (answer == image[0]) {
			right++;
			$('#error').text('');
		}
		else {
			mistake.push([image, answer]);
			$('#error').text('Это была буква ' + image[0] + '!');
		}
		showImage();
	}
}


function setTrainingType(a) {
	trainingtype = a;
	counter = 0;
	$('a').removeClass('active');
	if (a == 'scrambles') {
		$('#image').hide();
		$('#scramble').show();
		$('#results').hide();
		$('#error').hide();
	}
	else if (a=='ipll' || a=='la' || a=='ibld') {
		images = algs[a].slice();
		$('#image').show();
		$('#results').show();
		$('#scramble').hide();
		$('#error').text('');
		$('#error').show();
		right = 0;
		mistake = [];
	}
	else {
		images = algs[a].slice();
		$('#image').show();
		$('#scramble').hide();
		$('#results').hide();
		$('#error').hide();
	}
	$('#counter').show();
	rand = [];
	showImage();
}

//Показать картинку
function showImage() {   
	if (trainingtype == 'scrambles') {
		$('#scramble').text(getscramble());
		$('#error').hide();
		$('#counter').text(counter);
	}
	else if (trainingtype == 'la' || trainingtype == 'ipll' || trainingtype == 'ibld') {
		image = getRandomNumber();
		$('#image').html('<image src="'+dir+trainingtype+'/'+image+'.png"/>');	
		$('.yes').html(right);
		$('.no').html(mistake.length);
		$('#error').show();
		$('#counter').text(counter+'/'+algs[trainingtype].length);
	}
	else {
		$('#image').html('<image src="'+dir+trainingtype+'/'+getRandomNumber()+'.png"/>');
		$('#error').hide();	
		$('#counter').text(counter);
	}
	counter++;
	$('#mistakes').hide();	
}	

function showMistakes() {
	$('#error').hide();
	$('#image').hide();	
	$('#counter').hide();		
	var a = '';
	for (i = 0; i < mistake.length; i++) {
        a += '<tr>';
        a += '<td class="yes">' + mistake[i][0][0] + '</td>';
        a += '<td><img width="100" src="media/images/' + trainingtype + '/' + mistake[i][0] + '.png"/></td>';
        a += '<td class="no">' + mistake[i][1] + '</td>';
        a += '</tr>';
    }
	$('#mistakes').html(a);
	$('#mistakes').show();
}

$(document).ready(function() {
	setTrainingType('cll');
	$('#cll').addClass('active');
});

});