class Answer { //объявление класса: шаблон для создания одного варианта ответа
    answerText;
    wrongMessage;
    rightMessage;
    rightAnswer; // признак того, что ответ правильный true or false

    constructor(a, w, r, ra) { //конструктор принимает три аргумента
        this.answerText = a;
        this.wrongMessage = w; 
        this.rightMessage = r;
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
    surveyConfig;

    constructor(sc) {
        this.surveyConfig = sc;
    }

    hello() { //html шаблон для приветственного текста
        return '<p class="about-test">' + this.surveyConfig.startText + '</p><div class="btn-next-que"></div>';
    }

    getWrongOrRightStringForAnswer(answer) {
        return answer.rightAnswer ? 'right' : 'wrong';
    }

    answer(currentAnswer, index) {
        //currentAnswer = this.surveyConfig.questions[questionNumber].answers[answerNumber];
        let wrongOrRigthText = this.getWrongOrRightStringForAnswer(currentAnswer);
        return '<li id="answer' + index + '">' + currentAnswer.answerText + '</li>\
        <li id="post-answer' + index + '" class="' + wrongOrRigthText + '-answer" style="display:none;">' + currentAnswer.answerText + '</li>\
        <div id="message-answer' + index + '" class="message-' + wrongOrRigthText + '-answer" style="display:none;">\
            Ошибочка! Тестировщик хоть и не создает продукты, но вот системный администратор занимается совсем другим!\
        </div>';
    }

    question(question) {
        let textForAnswers = '';
        let counter = 0;
        question.answers.forEach(element => {
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

    execute() {
        $('#content').html(this.hello());
    }
}

function next(num, maxNum) {
    $('.btn-next-que').click(function() {
        $('#content').html(survey.question(survey.surveyConfig.questions[num]));
        $('#content .one-question-answer li').click(function() {
            $('#' + this.id).hide();
            $('#post-' + this.id).show();
            $('#message-' + this.id).show();
            $('#content .one-question-answer li').unbind('click');
            console.log(parseInt(parseInt(this.id.match(/\d+/))));
            if(++num < maxNum) {
                next(num);
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
            'Давай разберемся, станет ли для тебя профессия программиста удовольствием или окажется кошмаром наяву. Пройди небольшой тест из пяти вопросов и узнай об этом прямо сейчас!', //startText
            [            
                new Question( //создание экземпляра класса (одного вопроса)
                    'Вопрос 1',
                    [
                        new Answer('да', 'ну почему же да', 'а может да', true),
                        new Answer('нет', 'adsasd', 'asdasd', false),
                        new Answer('нsdfdsfsfет', '234243', '234243243', false)
                    ]
                ),
                new Question(
                    'Вопрос 2',
                    [
                        new Answer('да', 'ну почему же да', 'а может да', true),
                        new Answer('нет', 'adsasd', 'asdasd', false)
                    ]
                )
            ]  
    );

    survey = new Survey(config);
    survey.execute();
    next(0, survey.surveyConfig.questions.length);
});