import fetch from 'isomorphic-fetch';
import url from 'url';
import { token } from '../core/config';
import api from '../core/api';

const BASE_URL = 'https://graph.facebook.com/v2.6/me/messages'


export function sendTextMessage(sender, text) {
  const messageData = { 
    text: text,
    metadata: "TEST_TEST",
  };
  return fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: token,
      recipient: {
        id: sender,
      },
      message: messageData,
    }),
  })
  .then(res => res.json());
}

export async function sendButtonMessage(sender, text, buttons) {
  let messageData = {
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: text,
          buttons,
        }
      }
    }
  }
}

export function sendGenericMessage(sender) {
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
        }]
      }
    }
  }
  return fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: token,
      recipient: {
        id: sender,
      },
      message: messageData,
    }),
  })
  .then(res => res.json());
}
