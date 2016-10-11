import fetch from 'isomorphic-fetch';

const BASE_URL = 'http://jazzlion.com:4000/photo';

export function uploadPhoto(url) {
  return fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: "test",
      photoUrl: url,
    }),
  })
  .then(res => res.json());
}

