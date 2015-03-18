var algs = {
    '6stickers': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
    'ipll': ['H(1)', 'H(2)', 'H(3)', 'H(4)', 'U1(1)', 'U1(2)', 'U1(3)', 'U1(4)', 'U2(1)', 'U2(2)', 'U2(3)', 'U2(4)', 'Z(1)', 'Z(2)', 'Z(3)', 'Z(4)', 'A1(1)', 'A1(2)', 'A1(3)', 'A1(4)', 'A2(1)', 'A2(2)', 'A2(3)', 'A2(4)', 'E(1)', 'E(2)', 'E(3)', 'E(4)', 'F(1)', 'F(2)', 'F(3)', 'F(4)', 'G1(1)', 'G1(2)', 'G1(3)', 'G1(4)', 'G2(1)', 'G2(2)', 'G2(3)', 'G2(4)', 'G3(1)', 'G3(2)', 'G3(3)', 'G3(4)', 'G4(1)', 'G4(2)', 'G4(3)', 'G4(4)', 'J1(1)', 'J1(2)', 'J1(3)', 'J1(4)', 'J2(1)', 'J2(2)', 'J2(3)', 'J2(4)', 'N1(1)', 'N1(2)', 'N1(3)', 'N1(4)', 'N2(1)', 'N2(2)', 'N2(3)', 'N2(4)', 'R1(1)', 'R1(2)', 'R1(3)', 'R1(4)', 'R2(1)', 'R2(2)', 'R2(3)', 'R2(4)', 'T(1)', 'T(2)', 'T(3)', 'T(4)', 'V(1)', 'V(2)', 'V(3)', 'V(4)', 'Y(1)', 'Y(2)', 'Y(3)', 'Y(4)']
};

var autoplay = {
    49: [1500, '(1.5 sec)'],
    50: [2000, '(2 sec)'],
    51: [3000, '(3 sec)'],
    52: [4000, '(4 sec)'],
    53: [5000, '(5 sec)'],
};

var keys = {
    82: 'R',
    84: 'T',
    89: 'Y',
    85: 'U',
    65: 'A',
    70: 'F',
    71: 'G',
    72: 'H',
    90: 'Z',
    86: 'V',
    78: 'N',
    69: 'E',
    74: 'J'
};

var answer, image, trainingtype, repeatInterval;
var counter = 0;
var right = 0;
var mistake = {};
var dir = 'media/images/';
//default settings
var images = [];
var rand = [];
var test = [];

//Случайный элемент массива
function getRandomNumber() {
    if (rand.length == 0) {
        rand = images.slice();
        rand.sort(function() {
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
    setTimeout(function() {
        $('#error').fadeOut('fast')
    }, 2000);
}

$('body').ready(function() {
    $(document).bind('keydown', function(e) {
        key = e.keyCode;
        if (trainingtype == 'ipll') checkPLL(key);
        else if (key == 32) showImage();
        else if (autoplay[key]) {
            clearInterval(repeatInterval);
            repeatInterval = setInterval(showImage, autoplay[key][0]);
            showMessage('Autoplay ' + autoplay[key][1]);
        } else if (key == 48) {
            clearInterval(repeatInterval);
            showMessage('Autoplay OFF');
        }
    });

    $('a').click(function(event) {
        event.preventDefault();
        setTrainingType($(this).attr('id'));
        $(this).addClass('active');
    });

    $('button').click(function(event) {
        event.preventDefault();
        checkPLL($(this).attr('id'));
    });

    function checkPLL(key) {
        if (counter == algs[trainingtype].length + 1) {
            showMistakes();
            return;
        }
        if (keys[key] != null) {
            answer = keys[key];
            if (answer == image[0]) {
                right++;
                $('#error').text('');
            } else {
                mistake.push([image, answer]);
                $('#error').text('Это был ' + image[0] + '-perm!');
            }
            showImage();
        }
    }

    function setTrainingType(a) {
        trainingtype = a;
        counter = 0;
        $('a').removeClass('active');
        if (a == 'ipll') {
            images = algs[a].slice();
            $('#image').show();
            $('#results').show();
            $('#scramble').hide();
            $('#error').text('');
            $('#error').show();
            $('#buttons').show();
            right = 0;
            mistake = [];
        } else {
            images = algs[a].slice();
            $('#image').show();
            $('#scramble').hide();
            $('#results').hide();
            $('#error').hide();
            $('#buttons').hide();
        }
        $('#counter').show();
        rand = [];
        showImage();
    }

    //Показать картинку
    function showImage() {
        if (trainingtype == 'ipll') {
            image = getRandomNumber();
            $('#image').html('<image src="' + dir + trainingtype + '/' + image + '.png"/>');
            $('.yes').html(right);
            $('.no').html(mistake.length);
            $('#error').show();
            $('#counter').text(counter + '/' + algs[trainingtype].length);
        } else {
            $('#image').html('<image src="' + dir + trainingtype + '/' + getRandomNumber() + '.png"/>');
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
        $('#buttons').hide();
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
        setTrainingType('ipll');
        $('#ipll').addClass('active');
    });

});
