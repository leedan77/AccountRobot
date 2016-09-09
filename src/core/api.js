import fetch from 'isomorphic-fetch';
import { token } from './config';

const BASE_URL = 'https://graph.facebook.com/v2.6/me/'

function post(type, data) {
  return fetch(`${BASE_URL}${type}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(Object.assign(data, { access_token: token }))
  })
  .then(res => res.json());
}

export default { post };