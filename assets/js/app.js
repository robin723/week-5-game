$(document).ready(function(){

  // VARIABLES ##########

  var timer = {
    timeInit: 5,
    timeRemaining: 0,

    reset: function() {
      timer.stop();
      timer.timeRemaining = timer.timeInit;
      $('.time-remaining').text(timer.converter(timer.timeRemaining)).css('color','#3c763d');
    },

    start: function() {
      console.log('Timer started');

      // Set initial time
      timer.timeRemaining = timer.timeInit;
      $('.time-remaining').text(timer.converter(timer.timeRemaining)).css('color','#3c763d');

      // Start counting
      counter = setInterval(timer.countdown, 1000);
    },

    stop: function() {
      console.log('Timer stopped');

      clearInterval(counter);
    },

    countdown: function() {
      timer.timeRemaining--;
      if (timer.timeRemaining == 0) {
        // Out of time
        timer.stop();
        $('.time-remaining').text("Time Up").css('color','#a94442');
      }
      else {
        // Display time remaining
        $('.time-remaining').text(timer.converter(timer.timeRemaining)).css('color','#3c763d');
      }
    },

    converter: function(t) {
      if (t < 10) {
        return "00:0" + t;
      }
    }
  };

  var user = {
    totalCorrect: 0,
    isFirstTry: true,

    checkFirstTry: function() {
      $('.ansChoicesGroup').find('label').each(function() {
        if ($(this).hasClass('active') == true) {
          user.isFirstTry = false;
        }
      });
    },

    pass: function() {
      // User did not answer
      userTimeOut = setTimeout(displayCorrectAnswer,timer.timeInit*1000);
    },
    answered: function() {
      // If user answered, clear time out
      clearTimeout(userTimeOut);
      user.isFirstTry = false;
    }
  };

  var trivia = {
    q1: {
      question: 
        "Who wants to be the King of Pirates?",
      correctAnswer: 
        "Monkey D. Luffy",
      incorrectAnswers: [
        "Yassop",
        "Ussop",
        "Roronoa Zolo"
      ]
    },
    q2: {
      question: 
        "Who robbed pirates before he/she met Monkey D. Luffy?",
      correctAnswer: 
        "Nami",
      incorrectAnswers: [
        "Roronoa Zolo", 
        "Sanji", 
        "Tony Tony Chopper"
      ]
    },
    q3: {
      question: 
        "Who has Devil Fruit Powers?",
      correctAnswer: 
        "Monkey D. Luffy",
      incorrectAnswers: [
        "Roronoa Zolo", 
        "Sanji", 
        "Nami"
      ]
    },
    q4: {
      question: 
        "Who is Sanji?",
      correctAnswer: 
        "ship's cook",
      incorrectAnswers: [
        "ship's doctor", 
        "ship's carpenter", 
        "ship's musician"
      ]
    },
    q5: {
      question: 
        "What is the color of Tony Tony Chopper's nose?",
      correctAnswer: 
        "Blue",
      incorrectAnswers: [
        "Red", 
        "Pink", 
        "Yellow"
      ]
    },
    q6: {
      question: 
        "Roronoa Zolo is the master of the ____-sword style",
      correctAnswer: 
        "Three",
      incorrectAnswers: [
        "One", 
        "Two", 
        "Four"
      ]
    },
    q7: {
      question: 
        "Tony-Tony Chopper is a(n)...",
      correctAnswer: 
        "Man-reindeer",
      incorrectAnswers: [
        "Lion", 
        "Human", 
        "Dog"
      ]
    },
    q8: {
      question: 
        "Who is Monkey D. Luffy's father's name?",
      correctAnswer: 
        "Monkey D. Dragon",
      incorrectAnswers: [
        "Monkey D. Shanks", 
        "Monkey D. Ace",
        "Monkey D. Kapu"
      ]
    },

  };

  var qTotal;           // Total questions
  var qCurrent;         // Current question
  var qCount;           // Question number

  var answersArray;

  var correctAnsId;
  var selectedAnsId;

  // FUNCTIONS ##########

  // Generic shuffle function -- DO NOT CHANGE
  function shuffle(input) {
    for (var i = input.length-1; i >=0; i--) {
      var randomIndex = Math.floor(Math.random()*(i+1)); 
      var itemAtIndex = input[randomIndex]; 
      input[randomIndex] = input[i]; 
      input[i] = itemAtIndex;
    }
  }

  // Set qTotal
  function getTotalQuestions() {
    var counter = 0;
    $.each(trivia, function(index, value) {
      counter++;
    });
    qTotal = counter;
    console.log("Total questions: " + qTotal);
  }

  // Go to next question unless end of quiz
  function nextQuestion() {

    $('.quiz').empty();

    if (qCount == qTotal) {
      console.log("END OF QUIZ");

      timer.stop();
      $('.time-remaining').text("Time Up").css('color','#a94442');

      $('.quiz').hide();

      $('.results').show();
      $('.user-prompt').empty();

      var score = Math.floor((user.totalCorrect / qTotal) * 100);

      var scoreBox = $('<div>');
      scoreBox.addClass('final');
      scoreBox.html(
        '<p>Your Score:</p>' + 
        '<h1>' + score + '%</h1>'
      );

      $('.user-prompt').html(scoreBox);
      
      $('.start').text('Try Again');

    } else {
      console.log("NEXT QUESTION");

      qCount++;
      timer.reset();
      displayQuestion();
    }
  }

  function checkAnswer(selected) {
    
    // Clear timeouts
    user.answered();

    // Check if correct
    if (selected == correctAnsId) {
      console.log('Correct');
      var success = '<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>';
      $('#' + selected).parent().append(success);
      $('#' + selected).parent().addClass('correct');

      // Add 1 point
      user.totalCorrect++;
    } else {
      console.log('Incorrect');
      var fail = '<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>';
      $('#' + selected).parent().append(fail);
      $('#' + selected).parent().addClass('incorrect');

      // Show correct answer
      $('#' + correctAnsId).closest('label').removeClass('disabled').addClass('correct');
    }

    // Loop through answers
    // for (var i = 0; i < answersArray.length; i++) {
    // } // end of loop

    if (selected == "") {
      console.log("User passed");
      console.log("The correct answer was: " + correctAnsId);

      // Show correct answer
      // $('#' + correctAnsId).closest('label').addClass('correct');
    } else {
      console.log("User selected: " + selected);
    }

    // Update score
    $('#total-correct').text(user.totalCorrect);

    // On time out, move to next question
    setTimeout(nextQuestion,2000);
  }

  function displayCorrectAnswer() {
    checkAnswer("");
  }

  function displayQuestion() {

    // Set the current question
    $('#current-q').text(qCount);
    qCurrent = "q" + qCount;
    console.log(qCurrent);

    // Reset answers
    answersArray = [];
    correctAnswer = "";
    selectedAnsId = "";
    user.isFirstTry = true;

    // Start timer
    timer.start();

    // Create container for question
    var question = $('<div>');
    $(question).addClass('list-group-item-heading');
    $(question).text(trivia[qCurrent].question);
    $('.quiz').append(question);

    // Create container for answer choices
    var ansChoicesGroup = $('<div>');
    $(ansChoicesGroup).addClass('list-group');
    $(ansChoicesGroup).attr('data-toggle','buttons');
    $(ansChoicesGroup).addClass('ansChoicesGroup');
    $('.quiz').append(ansChoicesGroup);

    // Make random array of answer choices
    for (var i = 0; i < trivia[qCurrent].incorrectAnswers.length; i ++) {
      answersArray.push(trivia[qCurrent].incorrectAnswers[i]);
    }
    answersArray.push(trivia[qCurrent].correctAnswer);
    shuffle(answersArray);
    console.log(answersArray);

    // Loop through array to create each answer choice
    for (var i = 0; i < answersArray.length; i++) {

      var ansWrapper = $('<label>');
      $(ansWrapper).addClass('list-group-item');
      $(ansWrapper).addClass('inline');
      $(ansWrapper).addClass('btn');
      $(ansWrapper).addClass('ansChoice');
      $(ansWrapper).attr('aria-pressed','false');
      
      var ans = $('<input>');
      $(ans).attr('type','radio');
      $(ans).attr('name','choices');
      $(ans).attr('id','ansChoice' + i);
      $(ans).attr('autocomplete','off');

      $(ansWrapper).append(ans);
      $(ansWrapper).append(answersArray[i]);
      $(ansChoicesGroup).append(ansWrapper);

      // Get id of correct answer
      if (answersArray[i] == trivia[qCurrent].correctAnswer) {
        correctAnsId = $(ans).attr('id');
      }
    }

    // Register click on answer
    $('label').on('click', function() {

      // Check if all choices are unchecked
      user.checkFirstTry();

      if (user.isFirstTry) {
        console.log("First try");

        // ONLY RUN ON FIRST TRY

        // Stop timer
        timer.stop();

        // Get id of selected answer
        $(this).attr('aria-pressed','true');
        $(this).children('input').attr('checked',true);
        selectedAnsId = $('input:checked').attr('id');

        // Disable other choices
        for (var i = 0; i < answersArray.length; i++) {
          if ($('#ansChoice' + i).attr('id') !== selectedAnsId) {
            var unselected = $('#ansChoice' + i);
            $(unselected).parent('label').addClass('disabled');
          };
        }

        // Check if selected answer is correct
        checkAnswer(selectedAnsId);
      } else {
        console.log("Clicking again");
        return false;
      } 
    });

    // On time out, show correct answer
    user.pass();
  }

  function startGame() {

    $('.results').show();
    $('.user-stats').hide();
    $('.quiz').hide();

    var intro = $('<div>');
    intro.addClass('user-prompt');
   

    var startBtn = $('<a>');
    startBtn.addClass('btn btn-primary');
    startBtn.addClass('start');
    startBtn.attr('href','javascript:void(0)');
    startBtn.text('Start Quiz');
    $('.results').append(startBtn);

    $('.start').click(function() {

      $('.results').hide();
      $('.user-stats').show();
      $('.quiz').show();

      // Reset stats
      qCount = 1;
      user.totalCorrect = 0;

      // Set total number of questions
      getTotalQuestions();
      $('#total-q').text(qTotal);

      // Set initial score
      $('#total-correct').text(user.totalCorrect);

      displayQuestion();
    });
  }

  startGame();

}); // END ##########