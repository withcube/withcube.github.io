var algs = {
    '6stickers': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
    'ipll': ['H(1)', 'H(2)', 'H(3)', 'H(4)', 'H(5)', 'H(6)', 'H(7)', 'H(8)', 'H(9)', 'H(10)', 'H(11)', 'H(12)', 'H(13)', 'H(14)', 'H(15)', 'H(16)', 'U1(1)', 'U1(2)', 'U1(3)', 'U1(4)', 'U1(5)', 'U1(6)', 'U1(7)', 'U1(8)', 'U1(9)', 'U1(10)', 'U1(11)', 'U1(12)', 'U1(13)', 'U1(14)', 'U1(15)', 'U1(16)', 'U2(1)', 'U2(2)', 'U2(3)', 'U2(4)', 'U2(5)', 'U2(6)', 'U2(7)', 'U2(8)', 'U2(9)', 'U2(10)', 'U2(11)', 'U2(12)', 'U2(13)', 'U2(14)', 'U2(15)', 'U2(16)', 'Z(1)', 'Z(2)', 'Z(3)', 'Z(4)', 'Z(5)', 'Z(6)', 'Z(7)', 'Z(8)', 'Z(9)', 'Z(10)', 'Z(11)', 'Z(12)', 'Z(13)', 'Z(14)', 'Z(15)', 'Z(16)', 'A1(1)', 'A1(2)', 'A1(3)', 'A1(4)', 'A1(5)', 'A1(6)', 'A1(7)', 'A1(8)', 'A1(9)', 'A1(10)', 'A1(11)', 'A1(12)', 'A1(13)', 'A1(14)', 'A1(15)', 'A1(16)', 'A2(1)', 'A2(2)', 'A2(3)', 'A2(4)', 'A2(5)', 'A2(6)', 'A2(7)', 'A2(8)', 'A2(9)', 'A2(10)', 'A2(11)', 'A2(12)', 'A2(13)', 'A2(14)', 'A2(15)', 'A2(16)', 'E(1)', 'E(2)', 'E(3)', 'E(4)', 'E(5)', 'E(6)', 'E(7)', 'E(8)', 'E(9)', 'E(10)', 'E(11)', 'E(12)', 'E(13)', 'E(14)', 'E(15)', 'E(16)', 'F(1)', 'F(2)', 'F(3)', 'F(4)', 'F(5)', 'F(6)', 'F(7)', 'F(8)', 'F(9)', 'F(10)', 'F(11)', 'F(12)', 'F(13)', 'F(14)', 'F(15)', 'F(16)', 'G1(1)', 'G1(2)', 'G1(3)', 'G1(4)', 'G1(5)', 'G1(6)', 'G1(7)', 'G1(8)', 'G1(9)', 'G1(10)', 'G1(11)', 'G1(12)', 'G1(13)', 'G1(14)', 'G1(15)', 'G1(16)', 'G2(1)', 'G2(2)', 'G2(3)', 'G2(4)', 'G2(5)', 'G2(6)', 'G2(7)', 'G2(8)', 'G2(9)', 'G2(10)', 'G2(11)', 'G2(12)', 'G2(13)', 'G2(14)', 'G2(15)', 'G2(16)', 'G3(1)', 'G3(2)', 'G3(3)', 'G3(4)', 'G3(5)', 'G3(6)', 'G3(7)', 'G3(8)', 'G3(9)', 'G3(10)', 'G3(11)', 'G3(12)', 'G3(13)', 'G3(14)', 'G3(15)', 'G3(16)', 'G4(1)', 'G4(2)', 'G4(3)', 'G4(4)', 'G4(5)', 'G4(6)', 'G4(7)', 'G4(8)', 'G4(9)', 'G4(10)', 'G4(11)', 'G4(12)', 'G4(13)', 'G4(14)', 'G4(15)', 'G4(16)', 'J1(1)', 'J1(2)', 'J1(3)', 'J1(4)', 'J1(5)', 'J1(6)', 'J1(7)', 'J1(8)', 'J1(9)', 'J1(10)', 'J1(11)', 'J1(12)', 'J1(13)', 'J1(14)', 'J1(15)', 'J1(16)', 'J2(1)', 'J2(2)', 'J2(3)', 'J2(4)', 'J2(5)', 'J2(6)', 'J2(7)', 'J2(8)', 'J2(9)', 'J2(10)', 'J2(11)', 'J2(12)', 'J2(13)', 'J2(14)', 'J2(15)', 'J2(16)', 'N1(1)', 'N1(2)', 'N1(3)', 'N1(4)', 'N1(5)', 'N1(6)', 'N1(7)', 'N1(8)', 'N1(9)', 'N1(10)', 'N1(11)', 'N1(12)', 'N1(13)', 'N1(14)', 'N1(15)', 'N1(16)', 'N2(1)', 'N2(2)', 'N2(3)', 'N2(4)', 'N2(5)', 'N2(6)', 'N2(7)', 'N2(8)', 'N2(9)', 'N2(10)', 'N2(11)', 'N2(12)', 'N2(13)', 'N2(14)', 'N2(15)', 'N2(16)', 'R1(1)', 'R1(2)', 'R1(3)', 'R1(4)', 'R1(5)', 'R1(6)', 'R1(7)', 'R1(8)', 'R1(9)', 'R1(10)', 'R1(11)', 'R1(12)', 'R1(13)', 'R1(14)', 'R1(15)', 'R1(16)', 'R2(1)', 'R2(2)', 'R2(3)', 'R2(4)', 'R2(5)', 'R2(6)', 'R2(7)', 'R2(8)', 'R2(9)', 'R2(10)', 'R2(11)', 'R2(12)', 'R2(13)', 'R2(14)', 'R2(15)', 'R2(16)', 'T(1)', 'T(2)', 'T(3)', 'T(4)', 'T(5)', 'T(6)', 'T(7)', 'T(8)', 'T(9)', 'T(10)', 'T(11)', 'T(12)', 'T(13)', 'T(14)', 'T(15)', 'T(16)', 'V(1)', 'V(2)', 'V(3)', 'V(4)', 'V(5)', 'V(6)', 'V(7)', 'V(8)', 'V(9)', 'V(10)', 'V(11)', 'V(12)', 'V(13)', 'V(14)', 'V(15)', 'V(16)', 'Y(1)', 'Y(2)', 'Y(3)', 'Y(4)', 'Y(5)', 'Y(6)', 'Y(7)', 'Y(8)', 'Y(9)', 'Y(10)', 'Y(11)', 'Y(12)', 'Y(13)', 'Y(14)', 'Y(15)', 'Y(16)']
};

var autoplay = {
    49: [1500, '(1.5 sec)'],
    50: [2000, '(2 sec)'],
    51: [3000, '(3 sec)'],
    52: [4000, '(4 sec)'],
    53: [5000, '(5 sec)'],
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

    function checkPLL(key) {
        if (counter == algs[trainingtype].length + 1) {
            showMistakes();
            return;
        }
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
            right = 0;
            mistake = [];
        } else {
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
