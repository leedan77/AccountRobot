import { Router } from 'express';
import { sendTextMessage, sendGenericMessage, sendButtonMessage } from '../controllers/message';
import { createNewItem } from '../controllers/item';
const router = new Router();

router.get('/', (req, res) => {
    if (req.query['hub.verify_token'] === 'i_am_a_token_hehe') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
});

let newItemFlag = false;

function* newItemFlow(sender) { 
  const name = yield "name";
  const price = yield sendTextMessage(sender, `商品名稱: ${name}`);
  const type = yield sendTextMessage(sender, `價錢: ${price}`);
  yield sendTextMessage(sender, `類型: ${type}`);
  createNewItem(sender, name, type, price).then(res => {
    sendTextMessage(sender, `已儲存 新的項目: ${name}, 價錢: ${price}, 種類: ${type}`);
  }).catch(err => {
    console.error(err);
  });
}

let itemFlow;

router.post('/', async (req, res, next) => {
  try {
    for (let entry of req.body.entry) {
      for (let event of entry.messaging) {
        let sender = event.sender.id;
        console.log(JSON.stringify(event.message));
        if (event.postback) {
          let payload = event.postback.payload;
          if (payload === 'NEW_ITEM')  {
            sendTextMessage(sender, "請依序輸入: 商品名稱 價錢 類型");
            newItemFlag = true;
            itemFlow = newItemFlow(sender);
            itemFlow.next();
          } else if (payload === 'CANCEL_ITEM') {
            sendTextMessage(sender, "已取消新增項目");
            newItemFlag = false;
          }
          continue;
        }
        if (event.message && event.message.text && !event.message.is_echo) {
          let text = event.message.text;       
          if (newItemFlag) {
            const arrStr = text.split(' ');
            if (arrStr.length <= 3) {  
              for (let str of arrStr) {
                const isDone = itemFlow.next(str).done;
                if (isDone) {
                  newItemFlag = false;
                  break;
                }
              }
            } 
            
            /*if (arrStr.length == 3) {
              const name = arrStr[0];
              const price = Number(arrStr[1]);
              const type = arrStr[2];             
              await createNewItem(sender, name, type, price);
              sendTextMessage(sender, `已儲存 新的項目: ${name}, 價錢: ${price}, 種類: ${type}`);            
            }*/ else {
              const buttons = [{
                type: "postback",
                title: "取消新增項目",
                payload: "CANCEL_ITEM"
              }];
              const result = await sendButtonMessage(sender, "錯誤的格式, 請依序輸入: 商品名稱 價錢 類型", buttons);
            }
          }
        }
      }
      
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }  
});

export default router
