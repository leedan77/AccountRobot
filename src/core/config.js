import axios from 'axios';

export const port = process.env.PORT || 9000;
export const token = process.env.FB_PAGE_ACCESS_TOKEN;
export const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost/account_robot';

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
          title: 'Help',
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
        },
        {
          "type": "postback",
          "title": "新增新的紀錄",
          "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_START_ORDER"
        },
        {
          "type": "web_url",
          "title": "聯絡我",
          "url": "https://github.com/leedan77"
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

