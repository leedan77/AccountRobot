import fetch from 'isomorphic-fetch';
import url from 'url';
import { token } from './config';

const BASE_URL = 'https://graph.facebook.com/v2.6/me/messages'
const queryString = url.format({ 
  query: { access_token: token } 
});

function post(sender, data) {
  return fetch(`${BASE_URL}${queryString}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipient: {
        id: sender,
      },
      message: data,
    }),
  })
  .then(res => res.json());
}