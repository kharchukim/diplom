
//НАЧАЛО ОБЪЯВЛЕНИЯ КЛАССОВ (ШАБЛОНОВ) ДЛЯ ОТВЕТА, ВОПРОСА, НАСТРОЕК ВСЕГО ТЕСТА, ПРЕДСТАВЛЕНИЯ


function declOfNum(number, titles) {  
    cases = [2, 0, 1, 1, 1, 2];  
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
}

class Answer { //объявление класса: шаблон для создания одного варианта ответа
    answerText;
    message;
    rightAnswer; // признак того, что ответ правильный true or false

    constructor(a, m, ra) { //конструктор принимает три аргумента
        this.answerText = a;
        this.message = m; 
        this.rightAnswer = ra;
    }
}

class Question { //объявление класса: шаблон для создания одного варианта вопроса
    questionText;
    answers = [];

    constructor(qt, a) {
        this.questionText = qt;
        this.answers = a;
    }
}

class SurveyConfig { //объявление класса: шаблон для всего теста (все вопросы в массиве)
    questions = [];
    startText;

    constructor(st, qu) {
        this.questions = qu;
        this.startText = st;
    }

    deserialize(json) {
        let obj = JSON.parse(json);
        this.startText = obj.startText;
        let questions = [];
        obj.questions.forEach(el => {
            let answers = [];
            el.answers.forEach(el => {
                let answer = new Answer(
                    el.answerText,
                    el.message,
                    el.rightAnswer
                );
                answers.push(answer);
            });

            let question = new Question(
                el.questionText,
                answers
            );
            questions.push(question);
        });
        this.questions = questions;
    }
}

class Survey { //бизнес-логика для опроса
    surveyConfig; //все данные для опроса
    summRight = 0; //количество правильных ответов
    completeAnswers = []; // индексы завершенных вопросов

    constructor(sc) {
        this.surveyConfig = sc;
    }

    hello() { //html шаблон для приветственного текста (метод)
        return '<p class="about-test">' + this.surveyConfig.startText + '</p><div class="btn-test"></div>'; //формируется html-текст, который выводит абзац приветственного текста с кнопкой
    }

    answer(currentAnswer, index) { //метод формирует html для одного ответа
        let wrongOrRigthText = currentAnswer.rightAnswer ? 'right' : 'wrong'; //передаем в функцию класс Answer и если ответ right, то вернет строку rightAnswer
        return '<li id="answer' + index + '" data-right="' + wrongOrRigthText + '">' + currentAnswer.answerText + '</li>\
        <li id="post-answer' + index + '" class="' + wrongOrRigthText + '-answer" style="display:none;">' + currentAnswer.answerText + '</li>\
        <div id="message-answer' + index + '" class="message-' + wrongOrRigthText + '-answer" style="display:none;">\
            ' + currentAnswer.message + '\
        </div>';
    }

    question(question, numberOfQuestion) { //формирует html одного вопроса для вывода его на страницу
        let textForAnswers = '';
        let counter = 0;
        question.answers.forEach(element => { //element - каждый ответ
            textForAnswers += this.answer(element, counter++); 
        });
        return '<div class="one-question">\
            <p>Вопрос № ' + numberOfQuestion + ': ' + question.questionText + '</p>\
            <ul class="one-question-answer">' +
                textForAnswers +
            '</ul>\
        </div>\
        <div class="btn-next-que"></div>'
            + this.getCompleteAnswersHTML();
    }

    getCompleteAnswersHTML() {
        let html = '';
        for (let i = 1; i <= this.surveyConfig.questions.length; i++) {
            if (this.completeAnswers.indexOf(i) != -1) { //completeAnswers - массив с порядковыми номерами вопросов, на которые уже ответили
                html += '<span class="completed">' + i + '</span>'; //если на вопрос уже ответили
            } else {
                html += '<span id="circle' + i + '" class="uncompleted">' + i + '</span>'; //если на вопрос еще не ответили
            }
        }
        return '<div class="history">' + html + '</div>'; //строка с номерами вопросов
    }

    end() {
        let restart = '<div class="history"><a class="restart" href="">Начать заново</a></div>';
        let numStr = declOfNum(this.summRight, ['правильный ответ', 'правильных ответа', 'правильных ответов']);
        if(this.summRight > 3) {
            return '<p class="final-text">Поздравляю, ты сможешь!<br><br>Твой результат ' + this.summRight + ' ' + numStr + ' из ' + this.surveyConfig.questions.length + '!' + '</p>' + restart;
        }
        else{
            return '<p class="final-text">Упс!<br><br>Твой результат ' + this.summRight + ' ' + numStr + ' из ' + this.surveyConfig.questions.length + '. ' + '<br><br>' + 'Но не расстраивайся, в мире существует много других интересных профессий!</p>' + restart;
        }
    }
}

function showQuestion(num, maxNum) { //проверка, что вопрос еще не пройден
    while (survey.completeAnswers.indexOf(num+1) != -1) {
        num++;
    }
    console.log(num, maxNum);
    if (num >= maxNum) {
        $('#content').html(survey.end());
        return;
    }

    $('#content').html(survey.question(survey.surveyConfig.questions[num], num+1));
    //$('.btn-next-que, .btn-last-que').hide();
    $('#content .one-question-answer li').click(function() {
        //$('.btn-next-que, .btn-last-que').show();
        // добавляем сюда код, который увеличит счетчик (переменную) с правильными ответами в случае правильного ответа
        if($(this).data('right') == 'right') {
            survey.summRight++;
        }

        survey.completeAnswers.push(num); //добавление номеров вопросов в массив с номерами вопросов

        $('#' + this.id).hide();
        $('#post-' + this.id).show();
        $('#message-' + this.id).show();
        $('li').unbind('click');
        //console.log(parseInt(parseInt(this.id.match(/\d+/))));
        $('#circle' + num).removeClass('uncompleted').addClass('completed').unbind('click');
    });

    if(++num < maxNum) {
        next(num, maxNum);
    } else {
        $('.btn-next-que').removeClass('btn-next-que').addClass('btn-last-que');
        $('.btn-last-que').click(function() {
            $('#content').html(survey.end());
        });

        circleEvenetsBind(num, maxNum);
    }
}

function circleEvenetsBind(currentId, maxNum) {
    $('.uncompleted').click(function() { //функция, которая выполнится при клике на кнопку с номером вопроса
        let currentId = parseInt(this.id.match(/\d+/)) - 1;
        showQuestion(currentId, maxNum);
    });
}

function next(num, maxNum) { //рекурсивная функция - выводит сам html блока с вопросом и ответами и навешивает обработчики на соответствующие элементы
    $('.btn-next-que, .btn-test').click(function() { //функция, которая выполнится при клике на кнопку "след вопрос"
        showQuestion(num, maxNum);
    });

    circleEvenetsBind(num, maxNum);
}

//КОНЕЦ ОБЪЯВЛЕНИЯ КЛАССОВ (ШАБЛОНОВ) ДЛЯ ОТВЕТА, ВОПРОСА, НАСТРОЕК ВСЕГО ТЕСТА, ПРЕДСТАВЛЕНИЯ 

$(document).ready(function() {  //метод ready запускается только тогда, когда весь документ будет загружен
    let dataFromJSONFile = $.ajax({ //синхронный запрос json.txt
        url: 'config.json',
        async: false
    }).responseText;
    config = new SurveyConfig();
    config.deserialize(dataFromJSONFile);
    survey = new Survey(config);
    $('#content').html(survey.hello());
    next(0, survey.surveyConfig.questions.length);
});
