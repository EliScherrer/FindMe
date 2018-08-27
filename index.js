/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
// Global Data
//=========================================================================================================================================

const APP_ID = 'amzn1.ask.skill.9d440756-c773-4d0a-926e-bcba3d0a78aa';

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
      this.attributes.currentItemToStore = null;
      this.attributes.storedItems = {};

      this.response
        .speak('Thanks for using FindMe, I\'m excited to help you keep track of your stuff! ' +
              'What would you like to store?')
        .listen('What would you like to store?');
    }
    // returning user
    else {
      this.attributes.currentItemToStore = null;

      this.response
        .speak('Welcome back, do you need help finding or storing something?')
        .listen('Would you like to store or find something?');
    }

    this.emit(':saveState', true);
    this.emit(':responseReady');
  },

  // User says they want to store something
  'StoreIntent': function() {
    var itemToStore = this.event.request.intent.slots.possession.value;
    this.attributes.currentItemToStore = itemToStore;

     //TODO if user says "store something" in response to the launch dialog elicit the item

     // 1. confirm the item
        // TODO? maybe handled in console
     // 2. prompt the user for the location of that item
    this.response
      .speak('Where did you put ' + itemToStore + ' ?')
      .listen('Where did you put ' + itemToStore + ' ?');

    this.emit(':saveState', true);
    this.emit(':responseReady');
  },

  // User says where they are storing it
  'GiveLocationIntent': function() {
    var itemLocation = this.event.request.intent.slots.description.value;
    var itemToStore = 0; // TODO fill in from previous invocation

    // 1. make sure the user has already requested to store an item
    if (this.attributes.currentItemToStore !== null) {
      // 2. confirm their location description
      // 3. assign the location to the item and store it in the database
      // 4. clear the current item being stored from data
    }
    else {
      // this has to be accidental if they got here, ask for the item
      this.response
            .speak('What are you trying to store?')
            .listen('What are you trying to store?');
    }

    this.emit(':saveState', true);
    this.emit(':responseReady');
  },

  // User asks where they put something
  'LocateIntent': function() {
    var itemToLocate = this.event.request.intent.slots.possession.value;

    //TODO if user says "find something" in response to the launch dialog elicit the item

    // 1. check for item in dictionary
    var itemLocation = this.attributes.storedItems[itemToLocate];
    if (itemLocation) {
      // if found, return and ask if they want to clear the information from storage
      this.response
        .speak('Your ' + itemToLocate + ' is ' + itemLocation + ' . Would you like to keep it there or remove it from my memory?')
        .listen('Would you like to remove the location of your ' + itemToLocate + ' from my memory?');
    }
    else {
      // if NOT found, ask if they meant something else
      // TODO see if the word they input is close to something stored, or output a random stored item and see if they meant that
      this.response
        .speak('I\'m sorry, I couldn\'t find your ' + itemToLocate + ' . Did you mean something else?')
        .listen('Would you like me to try to find something else?');
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

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.dynamoDBTableName = 'FindMe';
    alexa.registerHandlers(handlers);
    alexa.execute();
};
