import { Router } from 'express';
import {
  sendTextMessage,
  sendGenericMessage,
  sendButtonMessage,
  sendReceipt,
  sendRapidReply,
  sendLinkMessage,
  sendLocationMap,
} from '../controllers/message';
import {
  parseQuery,
  createNewItem,
  getAllItems,
  getSameTypeItems,
  getFilterItems,
} from '../controllers/item';
import { uploadPhoto } from '../controllers/upload';
import newItemFlow from '../controllers/flow/newItem';
import Item from '../models/item';
const router = new Router();

router.get('/', (req, res) => {
    if (req.query['hub.verify_token'] === 'i_am_a_token_hehe') {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong token');
});

let newItemFlag = 0;
let itemFlow;
let item;

router.post('/', async (req, res, next) => {
  try {
    for (let entry of req.body.entry) {
      for (let event of entry.messaging) {
        let sender = event.sender.id;
        console.log(JSON.stringify(event.message));
        if (event.postback) {
          let payload = event.postback.payload;
          if (payload === 'NEW_ITEM') {
            item = new Item();
            await item.save();
            sendTextMessage(sender, "請輸入商品名稱");
            itemFlow = newItemFlow(sender, item);
            newItemFlag = itemFlow.next().value;
          } else if (payload === 'CANCEL_ITEM') {
            sendTextMessage(sender, "已取消新增項目");
            newItemFlag = 0;
          } else if (payload === 'SHOW_RECORD') {
            const items = await getAllItems(sender);
            await sendReceipt(sender, items);
          } else if (payload === 'SHOW_CARD') {
            const items = await getAllItems(sender, 10);
            const res = await sendGenericMessage(sender, items);
          } else if (payload.startsWith('TYPE_')) {
            const type = payload.replace('TYPE_', '');
            const items = await getSameTypeItems(type);
            const res = await sendGenericMessage(sender, items);
          } else if (payload === 'SHOW_ITEM_MAP') {
            const res = await sendLocationMap(sender);
          }
          continue;
        }
        if (event.message && event.message.text && !event.message.is_echo) {
          let text = event.message.text;       
          if (newItemFlag) {
            newItemFlag = itemFlow.next(text).value;
          } else {
            let query = text.split(' ').reduce((acc, q) => {
              let parsedQuery = parseQuery(q);
              return Object.assign(acc, parsedQuery);
            }, {});
            console.log(query);
            const items = await getFilterItems(sender, 10, query);
            if (items == null) {
              continue;
            }
            const res = await sendGenericMessage(sender, items);
            console.log(items);
          }
        }
        // attachment
        if (event.message && event.message.attachments && !event.message.is_echo) {
          if (newItemFlag === 'name') {
            let attachments = event.message.attachments;
            for (let attachment of attachments) {
              const { result } = await uploadPhoto(attachment.payload.url);
              item.image = attachment.payload.url;
              item.save();
              const res = await sendRapidReply(sender, "選取符合的名字", result);
            }
          } else if (newItemFlag === 'location') {
            let attachments = event.message.attachments;
            for (let attachment of attachments) {
              const loc = attachment.payload.coordinates;
              newItemFlag = itemFlow.next(loc).value; 
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

export default router;
