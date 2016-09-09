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
  console.log(req.body.entry);
  for (let entry of req.body.entry) {
    for (let event of entry.messaging) {
      let sender = event.sender.id;
      if (event.message && event.message.text) {
        let text = event.message.text;
        if (text === 'Generic') {
           sendGenericMessage(sender)
           .then(res => {
            console.log(res);
           });
           continue;
        }
        sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        .then(res => {
          console.log(res);
        });
      }
      if (event.postback) {
        console.log(event.postback)
        let text = JSON.stringify(event.postback);
        sendTextMessage(sender, "Postback received: "+ text.substring(0, 200))
        .then(res => {
          console.log(res);
        });
        continue;
      }
    }
    
  }
  res.sendStatus(200);
});

export default router
