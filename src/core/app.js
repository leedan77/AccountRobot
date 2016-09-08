import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import request from 'request';
import { initChatMenu } from './config';

initChatMenu();
const app = express();

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello world, I am a chat bot');
});

// for Facebook verification
app.get('/webhook/', (req, res) => {
    if (req.query['hub.verify_token'] === 'i_am_a_token_hehe') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
});

app.post('/webhook/', (req, res) => {
  //sendWelcomeMessage();
  let messaging_events = req.body.entry[0].messaging;
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i];
    let sender = event.sender.id;
    if (event.message && event.message.text) {
      let text = event.message.text;
      if (text === 'Generic') {
         sendGenericMessage(sender);
         continue;
      }
      sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200));
    }
    if (event.postback) {
      let text = JSON.stringify(event.postback);
      sendTextMessage(sender, "Postback received: "+ text.substring(0, 200), token);
      continue;
    }
  }
  res.sendStatus(200);
});

// API PART
const token = process.env.FB_PAGE_ACCESS_TOKEN;

/*
function sendWelcomeMessage() {
  let greetData = {
    "setting_type": "greeting",
    "greeting": {
      "text": "我是幫你記帳的小幫手喔>__<"
    }
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {access_token: token},
    method: 'POST',
    json: greetData,
  }, function(error, response, body){
    if(error) console.error(error);
    else {
      console.log(body);
    }
  });

}
*/

function sendTextMessage(sender, text) {
  let messageData = { text:text }
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
          recipient: {id:sender},
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  })
}

function sendGenericMessage(sender) {
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "First card",
          "subtitle": "Element #1 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.messenger.com",
            "title": "web url"
          }, {
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for first element in a generic bubble",
          }],
        }, {
          "title": "Second card",
          "subtitle": "Element #2 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
          "buttons": [{
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for second element in a generic bubble",
          }],
        }]
      }
    }
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

export default app;

