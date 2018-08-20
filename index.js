/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
// Global Data
//=========================================================================================================================================

const APP_ID = 'amzn1.ask.skill.f3656c04-186d-4ba6-b62f-294c2f1a9db8';

const SKILL_NAME = 'Find me';
const HELP_MESSAGE = 'You can say... fuck, ask the dev what to say'; // TODO
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Peace out my dude!';

//=========================================================================================================================================
// Do logic here
//=========================================================================================================================================

var handlers = {

  // Open Codecademy Flashcards
  'LaunchRequest': function() {

    // if new user
    if (Object.keys(this.attributes).length === 0) {
      this.attributes.numberCorrect = 0;
      this.attributes.currentFlashcardIndex = 0;

      this.response
        .speak('Welcome to the state capitals quiz. ' + AskQuestion(this.attributes))
        .listen(AskQuestion(this.attributes));
    }
    else {
      var currentIndex = this.attributes.currentFlashcardIndex || 0;
      var numberCorrect = this.attributes.numberCorrect || 0;
      this.response
        .speak('Welcome back to the state capitals quiz. You are on question ' + currentIndex + 
              ' and have answered ' + numberCorrect + ' correctly. ' +
              'The next question is... ' + AskQuestion(this.attributes))
        .listen('i\'ve been listening... ');
    }
    this.emit(':saveState', true);
    this.emit(':responseReady');
  },

  // User gives an answer
  'AnswerIntent': function() {
    var currentFlashcardIndex = this.attributes['currentFlashcardIndex'];
    var currentState = statesAndCaptials[currentFlashcardIndex].state;
    var userAnswer = this.event.request.intent.slots.answer.value || 'suck';
    var correctAnswer = statesAndCaptials[currentFlashcardIndex].capital || 'suck';

    // user is correct
    if (userAnswer === correctAnswer) {
      this.attributes.currentFlashcardIndex++;
      this.attributes.numberCorrect++;
      this.response
        .speak("Great Job! Next question... " + AskQuestion(this.attributes))
        .listen(AskQuestion(this.attributes));
    }
    //user is wrong
    else {
      this.attributes.currentFlashcardIndex++;
      this.response
        .speak("Ohhh, sorry, the capital of " + currentState + " is " + correctAnswer +
          '. The next question is... ' + AskQuestion(this.attributes)) 
        .listen(AskQuestion(this.attributes));
    }

    this.emit(':saveState', true);
    this.emit(':responseReady');
  },

  // Stop
  'AMAZON.StopIntent': function() {
      this.response.speak('Ok, let\'s play again soon.');
      this.emit(':saveState', true);
      this.emit(':responseReady');
  },

  // Cancel
  'AMAZON.CancelIntent': function() {
      this.response.speak('Ok, let\'s play again soon.');
      this.emit(':saveState', true);
      this.emit(':responseReady');
  },

  // Save state
  'SessionEndedRequest': function() {
    console.log('session ended!');
    this.emit(':saveState', true);
  }

};

var AskQuestion = function(attributes) {
    var currentFlashcardIndex = attributes.currentFlashcardIndex;
    var currentState = statesAndCaptials[currentFlashcardIndex].state;

    return ('What is the capital of ' + currentState + '?');
};

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.dynamoDBTableName = 'FindMe';
    alexa.registerHandlers(handlers);
    alexa.execute();
};
