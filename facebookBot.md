---
這篇主要是講解如何從頭開始 build up 一個 facebook messenger bot，

如果習慣閱讀英文教學文章的人也可以直接參考

[官方文件]以及非常清楚的[github教學]。

## First thing first

在教學開始前，

首先需了解 facebook 聊天機器人是怎麼運作的，

聊天機器人是為了讓粉絲專頁自動回覆所設計的東西，

而我們需要的是一台 web server 處理接收到的訊息，

並通過 facebook 的驗證才能讓 web server 透過粉絲專頁

向客戶發送訊息。

## Build Up Server

在驗證之前我們必須先架設一個擁有自己 domain name 並且是 https 的 web server

一定要注意`自己的domain name 跟 https`，

如果各位有自己的 web server 當然是最好，

而在這邊介紹的是 heroku server 的架設方法，

[heroku] 提供免費的 domain name 和 ssl 憑證。


1. 到這裡 https://toolbelt.heroku.com 下載 heroku 所需要的工具包，
並到 [heroku] 註冊一個帳號。
2. 安裝 node 相關的 dependency，在這邊不再贅述直接看 code，在 index.js 新增這些
```js
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express();

app.set('port', (process.env.PORT || 9000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
  res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', (req, res) => {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
      res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})
```
3. 創建 [Procfile](https://devcenter.heroku.com/articles/procfile)並新增下面這行，Procfile 是讓 heroku 知道 deploy 時要執行什麼指令。
```sh 
web: node index.js
```
4. 之後把 code commit 到 heroku 來 deploy
```sh
git init
git add .
git commit -m 'First commit'
heroku create
git push heroku master
```

接著可以輸入
```sh
heroku apps:open
```
來打開剛剛建立的 web server，並把網址複製起來等下驗證是會使用到。

也可以輸入
```sh
heroku logs -t
```
來檢查伺服器 deploy 的狀況

## Authentication

首先必須在[這裡](https://developers.facebook.com/apps/)創建屬於自己的 facebook app，

左側欄下方 add Product 來新增產品選擇 Messenger。
![new product](https://scontent-tpe1-1.xx.fbcdn.net/t39.2178-6/12995587_195576307494663_824949235_n.png)

### Webhook

選擇 `Setup Webhook` 

![webhook](https://scontent-tpe1-1.xx.fbcdn.net/t39.2178-6/12057143_211110782612505_894181129_n.png)

這邊的 callback url 把剛剛複製的網址貼上去並加上`webhook`，

verify token 則是必須跟 code 中 query 一樣，

記得把下面的欄位全數打勾。

驗證不成功的原因通常是
`沒有 domain name 或非 https 的網址`。

### Token Generation

在 Token Generation 欄位中選取自己想使用的粉絲專頁並且產生 Token，

然後在下方 Webhook 選擇要 subscribe 的粉絲專頁，

完成後粉絲專頁就可以利用 Token 來接發送訊息囉！

## Let the Bot talks

1. 在 index.js 下方增加 post 的 api
> 這邊建議查看官方的 [api](https://developers.facebook.com/docs/messenger-platform/webhook-reference#format) 來了解 req 到底傳了什麼東西過來
```js
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

const token = "<PAGE_ACCESS_TOKEN>"
```

強烈建議把 token 設成環境變數，

避免把秘密暴露在公開網路之中。

> heroku 的環境變數可以透過它的 dashboard 或是 command line 來設定 
> https://devcenter.heroku.com/articles/config-vars

透過 command line
```sh
heroku config:set FB_PAGE_ACCESS_TOKEN=blbablablaAjga213bala

# view
heroku config
```

如果在 local 端開發則可以在 shell 中設定環境變數

```sh
# 只會存在在這次的 shell session 中
export FB_PAGE_ACCESS_TOKEN=blbablablaAjga213bala

# 或是把它加到你的 shell config 中 (.bashrc / config.fish / .bash_profile)
# export FB_PAGE_ACCESS_TOKEN=blbablablaAjga213bala

echo $FB_PAGE_ACCESS_TOKEN
```

* 在 node js 中可用下面這方式來存取
```js
const token = process.env.FB_PAGE_ACCESS_TOKEN;
```

2. 讓機器人回覆訊息
```js
function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
```

好惹大功告成這時候重新 push 到 heroku 上面，

打開你的 facebook 跟你的機器人 say Bye 吧！

## 更酷更炫的回覆

![template](https://scontent-tpe1-1.xx.fbcdn.net/t39.2178-6/13331576_291859617816127_1434046125_n.png)

除了一般的訊息，

facebook robot 還可以以按鈕、卡片的形式回覆。

直接來看 code ：
```js
function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
```

### Handle Postback

如果使用者按了按鈕要怎麼處理呢？

我們在 post api 這邊送出 Generic Message，

並 handle 按鈕的 callback。
```js
app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      if (event.message && event.message.text) {
        let text = event.message.text
        if (text === 'Generic') {
            sendGenericMessage(sender)
            continue
        }
        sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
      }
      if (event.postback) {
        let text = JSON.stringify(event.postback)
        sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
        continue
      }
    }
    res.sendStatus(200)
  })
```

重新 push 到 heroku 上，
並試著打`Generic`看看會發生什麼事吧！

## What's next?
更詳盡的api說明：[官方文件]

讓機器人擁有大腦： wit.ai

## Conclusion

作為下個世代全新的體驗，

聊天機器人目前還沒有什麼驚為天人的應用，

下次的文章我會說說我想用 facebook bot 做什麼東西。

那就這樣囉我們下次見~

Bye-bye





[官方文件]: https://developers.facebook.com/docs/messenger-platform/quickstart
[github教學]: https://github.com/jw84/messenger-bot-tutorial
[heroku]: https://www.heroku.com/





