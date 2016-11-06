import axios from 'axios';
import api from './api';

export const port = process.env.PORT || 9000;
export const token = process.env.FB_PAGE_ACCESS_TOKEN;
export const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost/account_robot';

export function initNewThreadBtn() {
  return api.post("thread_settings", {
    setting_type: "call_to_actions",
    thread_state: "new_thread",
    call_to_actions: [{
      payload: "NEW_THREAD",
    }],
  });
}

export function initChatMenu() {
  axios.post(
    'https://graph.facebook.com/v2.6/me/thread_settings',
    {
      access_token: token,
      setting_type: 'call_to_actions',
      thread_state: 'existing_thread',
      call_to_actions: [
        {
          type: 'postback',
          title: '我的紀錄',
          payload: 'SHOW_RECORD',
        },
        {
          "type": "postback",
          "title": "新增新的項目",
          "payload": "NEW_ITEM"
        },
        {
          type: "postback",
          title: "列出項目",
          payload: "SHOW_CARD"
        },
        {
          type: "postback",
          title: "列出所有類別",
          payload: "SHOW_ALL_TYPE",
        },
        {
          type: "postback",
          title: "商品地圖",
          payload: "SHOW_ITEM_MAP",
        }
      ]
    },
    {
      header: {
        'Content-type': 'application/json',
      }
    }
  )
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error);
  })
}

