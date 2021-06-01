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
}

class Survey { //бизнес-логика для опроса
    surveyConfig; //все данные для опроса

    constructor(sc) {
        this.surveyConfig = sc;
    }

    hello() { //html шаблон для приветственного текста
        return '<p class="about-test">' + this.surveyConfig.startText + '</p><div class="btn-next-que"></div>'; //формируется html-текст, который выводит абзац приветственного текста с кнопкой
    }

    getWrongOrRightStringForAnswer(answer) { 
        return ;
    }

    answer(currentAnswer, index) { //функция формирует html для одного ответа
        let wrongOrRigthText = answer.rightAnswer ? 'right' : 'wrong'; //передаем в функцию класс Answer и если ответ right, то вернет строку rightAnswer
        return '<li id="answer' + index + '">' + currentAnswer.answerText + '</li>\
        <li id="post-answer' + index + '" class="' + wrongOrRigthText + '-answer" style="display:none;">' + currentAnswer.answerText + '</li>\
        <div id="message-answer' + index + '" class="message-' + wrongOrRigthText + '-answer" style="display:none;">\
            ' + currentAnswer.message + '\
        </div>';
    }

    question(question) {
        let textForAnswers = '';
        let counter = 0;
        question.answers.forEach(element => { //element - каждый ответ
            textForAnswers += this.answer(element, counter++); 
        });
        return '<div class="one-question">\
            <p>' + question.questionText + '</p>\
            <ul class="one-question-answer">' +
                textForAnswers +
            '</ul>\
        </div>\
        <div class="btn-next-que"></div>';
    }

    end() {
        return '<p class="about-test">The end.</p>';
    }
}

function next(num, maxNum) {
    $('.btn-next-que').click(function() { //функция, которая выполнится при клике на кнопку "след вопрос"
        $('#content').html(survey.question(survey.surveyConfig.questions[num]));
        $('#content .one-question-answer li').click(function() {
            $('#' + this.id).hide();
            $('#post-' + this.id).show();
            $('#message-' + this.id).show();
            $(this).unbind('click');
            //console.log(parseInt(parseInt(this.id.match(/\d+/))));
            if(++num < maxNum) {
                next(num, maxNum);
            } else {
                $('.btn-next-que').click(function() {
                    $('#content').html(survey.end());
                });
            }
        });
    });
}

$(document).ready(function() {  //метод ready запускается только тогда, когда весь документ будет загружен
    config = new SurveyConfig( //создание экземпляра класса (всего теста)
            'Давай разберемся, станет ли для тебя профессия frontend-разработчика удовольствием или окажется кошмаром наяву. Пройди небольшой тест из пяти вопросов и узнай об этом прямо сейчас!', //startText
            [            
                new Question( //создание экземпляра класса (одного вопроса)
                    'А вот и первый, но очень простой вопрос. Найди в ряду лишнее: ',
                    [
                        new Answer('тестировщик', 'Ошибочка! Тестировщик хоть и не создает продукты, но вот системный администратор занимается совсем другим!', false),
                        new Answer('системный администратор', 'Это было проще простого!',  true),
                        new Answer('программист', 'Ошибочка! Программист хоть и не создает продукты, но вот системный администратор занимается совсем другим!', false)
                    ]
                ),
                new Question(
                    'Что самое главное общее между бабочкой и слоном?',
                    [
                        new Answer('уши слона как крылья бабочки', 'Ну нет же! Они хоть и похожи, но тебе нужно было быть внимательнее!', false),
                        new Answer('у обоих есть хобот', 'Именно!', true),
                        new Answer('они оба маленькие', 'Хорошая шутка с твоей стороны!', false)
                    ]
                ),
                new Question(
                    'Что должен знать фронтенд-разработчик? Назовите три ключевых технологии:',
                    [
                        new Answer('PHP, HTML и CSS', 'HTML и CSS он, конечно, должен знать обязательно, а вот PHP - это уже бэкенд-разработка.', false),
                        new Answer('HTML, CSS и JavaScript', 'Бинго! Фронтенд — то, как выглядит сайт. Ключевые технологии фронтенда — HTML, CSS и JavaScript', true),
                        new Answer('Kotlin, PHP и JavaScript', 'JavaScript он, конечно, должен знать обязательно, а вот Kotlin и PHP - это уже не его работа.', false)
                    ]
                ),
                new Question(
                    'Возвращаемся к стереотипным задачам. Разработчик приезжает в новый город, заселяется в гостиницу и спрашивает у девушки на стойке администрации, где можно вкусно и недорого поесть. Девушка протягивает разработчику карту, где отмечает маркером место и рисует дорогу. Как поступит разработчик?',
                    [
                        new Answer('Будет чётко следовать карте', 'Верно мыслите. Разработчик, погружаясь в незнакомую среду обитания, руководствуется авторитетным мнением и технической документацией', true),
                        new Answer('Постарается найти путь покороче', 'Это неплохой вариант, но в данной ситуации он не подходит совсем.', false),
                        new Answer('Отправится в долгие поиски, проверяя цены во всех окружающих кафе и ресторанах', 'Разработчику лучше быть немного ленивым, чтобы ему не приходила в голову идея "написать велосипед"!', false)
                    ]
                ),
                new Question(
                    'Завершаем наше тестирование непосредственно кодом. Что выведет в консоль этот код?',
                    // let x = 3;
                    // function fn() {
                    //     x = 10;
                    //     return;
                    //     function x() {}
                    // }
                    // fn();
                    // console.log(x);
                    [
                        new Answer('10', 'Неверно! Но, возможно, тебе просто нужно было подумать подольше.', false),
                        new Answer('3, поскольку х объявлена как функция, поэтому в итоге она перезаписалась с 10 на 3', true),
                        new Answer('13', 'Неверно! Но, возможно, тебе просто нужно было подумать подольше.', false)
                    ]
                ),
            ]  
    );

    survey = new Survey(config);
    $('#content').html(survey.hello());
    next(0, survey.surveyConfig.questions.length);
});


