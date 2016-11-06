import fetch from 'isomorphic-fetch';
import url from 'url';
import { token } from '../core/config';
import api from '../core/api';
import { getAllItems } from './item';

const BASE_URL = 'https://graph.facebook.com/v2.6/me/messages';


export function sendTextMessage(sender, text) {
  const messageData = { 
    text: text,
    metadata: "TEST",
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

export function sendButtonMessage(sender, text, buttons) {
  let messageData = {
    recipient: {
      id: sender,
    },
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
  return api.post('messages', messageData);
}

export function sendLinkMessage(sender, name) {
  let messageData = {
    recipient: {
      id: sender,
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
          {
            title: "推薦商品",
            subtitle: name,
            item_url: `http://ecshweb.pchome.com.tw/search/v3.3/?q=${name}`,
            buttons: [
              {
                type: "web_url",
                url: `http://ecshweb.pchome.com.tw/search/v3.3/?q=${name}`,
                title: "前往查看",
              }
            ]
          }]
        }
      }
    }
  }
  return api.post('messages', messageData);
}

export function sendGenericMessage(sender, items) {
  let elements = items.map(item => {
    return {
      title: item.name,
      subtitle: `$${item.price} (${item.createdAt.toLocaleDateString()})`,
      image_url: item.image,
      buttons: [{
        type: "postback",
        title: "查看同種類的項目",
        payload: `TYPE_${item.type}`,
      }],
    };
  });
  let messageData = {
    recipient: {
      id: sender,
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements,
        }
      }
    }
  }
  return api.post('messages', messageData);
}

export function sendReceipt(sender, items) {
  let cost = 0;
  let elements = items.map(item => {
    cost += item.price;
    return {
      title: item.name,
      subtitle: item.type,
      price: item.price,
    };
  });
  let messageData = {
    recipient: {
      id: sender,
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "receipt",
          recipient_name: sender,
          order_number: "77",
          currency: "TWD",
          payment_method: "現金",
          elements,
          summary: {
            total_cost: cost,
          },
        }
      }
    }
  };
  return api.post('messages', messageData);
}

export function sendRapidReply(sender, title, reply) {
  let quick_replies = reply.reduce((acc, r) => {
    if (r) {
      if (r.length > 20)
        r = r.substr(0, 20);
      acc.push({
        content_type: 'text',
        title: r,
        payload: 'QUICK_REPLY',
      });
    }
    return acc;
  }, []);

  console.log(quick_replies);
  let messageData = {
    recipient: {
      id: sender,
    },
    message: {
      text: title,
      quick_replies,
    }
  };
  return api.post('messages', messageData);
}

export function sendRequestLocation(sender, title) {
  let messageData = {
    recipient: {
      id: sender,
    },
    message: {
      text: title,
      quick_replies: [{
        content_type: 'location',
      }]
    }
  };
  return api.post('messages', messageData);
}

function parseLocation(items) {
  return items.reduce((acc, item) => {
    acc.concat(`markers=${item.loc.lat},${item.loc.long}&`)
  }, "");
}

export async function sendLocationMap(sender, loc) {
  const items = await getAllItems(sender);
  console.log(items);
  let locString = parseLocation(items);
  let messageData = {
    recipient: {
      id: sender,
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: {
            element: {
              title: '您的商品地圖',
              image_url: `https://maps.googleapis.com/maps/api/staticmap?size=764x400&center=${items[0].loc.lat},${items[0].loc.long}&zoom=25&${locString}`
            }
          }
        }
      }
    }
  };
  return api.post('messages', messageData);
}

