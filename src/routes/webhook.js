import { Router } from 'express';
import { sendTextMessage, sendGenericMessage } from '../controllers/message';
const router = new Router();

router.get('/', (req, res) => {
    if (req.query['hub.verify_token'] === 'i_am_a_token_hehe') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
});

router.post('/', (req, res) => {
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

export default router
