// https://webhook-app-demo.herokuapp.com/webhook

const express = require('express'),
    webhook = express.Router(),
    request = require('request'),
    line = require('@line/bot-sdk'),
    path = require('path'),
    findDistance = require('../model/findDistance'),
    Home = require('../model/Home')

const AIMLInterpreter = require('aimlinterpreter')
const cp = require('child_process');
const aimlInterpreter = new AIMLInterpreter({ name: 'HelloBot' })
const { WebhookClient } = require('dialogflow-fulfillment');
// aimlInterpreter.loadAIMLFilesIntoArray(['./aiml_linebot.xml'])

const config = {
    channelAccessToken: "KF435sOwdUpGPvW5jHapfL3VKuV4qmCyN9sNrWC+JXWAt/Mcf2BBxkR3cq0+Lo4fPZZM4LclJgMTRllFbW8IRlZasmGHQQGgAyIoWxpFwZkmCpaqcOF3GAuDXbEazU1wrr1651JhcwG1nOHdxZlvygdB04t89/1O/w1cDnyilFU=",
    channelSecret: 'cc851872c4bf659d2bed0d0a8fee7f19'
}

const client = new line.Client(config)

var value = ""
var value1 = ""

webhook.post('/webhook', line.middleware(config), async (req, res) => {
    // console.log(request.body);
    // res.send('sad')
    // console.log(req.body.events);

    // const homes = await Home.find(this.all)

    // const latitude = 1
    // const longitude = 2

    // var GPS = function (lat, lnt) {
    //     this.latitude = lat || 0;
    //     this.longitude = lnt || 0;
    // };

    // var distance = 0

    // const x = homes.filter((item) => {
    //     var gps1 = new GPS(+latitude, +longitude);
    //     var gps2 = new GPS(+item.latitude, +item.longitude);


    //     distance = findDistance(gps1, gps2)
    //     distance = distance - 10980000
    //     console.log(distance);

    //     if (distance < 5000)
    //         return item
    //     // nearby.push(item)
    // })
    // console.log(x);

    // res.send('ok')
    res.send(req.body)

    Promise.all(req.body.events.map(handleReply))
        .then(() => res.end())
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });

})


const handleReply = (event) => {

    if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
        return console.log("Test hook recieved: " + JSON.stringify(event.message));
    }
    console.log(event);

    switch (event.type) {
        case 'message':
            const message = event.message;
            switch (message.type) {
                case 'text':
                    return handleText(message, event.replyToken, event.source);
                case 'image':
                    return handleImage(message, event.replyToken);
                case 'video':
                    return handleVideo(message, event.replyToken);
                case 'audio':
                    return handleAudio(message, event.replyToken);
                case 'location':
                    return handleLocation(message, event.replyToken);
                case 'sticker':
                    return handleSticker(message, event.replyToken);
                default:
                    throw new Error(`Unknown message: ${JSON.stringify(message)}`);
            }
        case 'postback':
            let data = event.postback.data;
            console.log(data);
            const buttonsImageURL = 'https://ak.picdn.net/shutterstock/videos/12523241/thumb/1.jpg'
            value = data
            console.log("value" + value);
            switch (data) {

                case 'saleHome2m':
                    value1 = 'saleHome2m'
                    console.log("value1" + value1);
                    return client.replyMessage(
                        event.replyToken,
                        {
                            type: 'template',
                            altText: 'Buttons alt text',
                            template: {
                                type: 'buttons',
                                thumbnailImageUrl: buttonsImageURL,
                                title: 'My button sample',
                                text: 'Hello, my button',
                                actions: [
                                    { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
                                    { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                                    { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
                                    { label: 'Say message', type: 'message', text: 'Rice=米' },
                                ],
                            },
                        }
                    );

                default:
                    console.log(`Echo message to ${replyToken}: ${message.text}`);
                    return replyText(event.replyToken, event.message.text);
            }

        case 'beacon':
            return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);

    }

}
const replyText = (token, texts) => {
    texts = Array.isArray(texts) ? texts : [texts];
    return client.replyMessage(
        token,
        {
            type: 'text',
            text: "ระบุข้อมความไม่ถูกต้อง",
            quickReply: {
                items: [
                    {
                        type: "action", // ③
                        // imageUrl: "https://example.com/sushi.png",
                        action: {
                            type: "message",
                            label: "testlocal",
                            text: `${value}`
                        }
                    },
                    {
                        "type": "action", // ④
                        "action": {
                            "type": "location",
                            "label": "Send location"
                        }
                    }
                ]
            }
        });
};


const handleText = async (message, replyToken, source) => {
    // const text = await aimlInterpreter.findAnswerInLoadedAIMLFiles(message, (answer, wildCardArray, input) => {
    //     console.log(answer);
    //     // return answer
    // })



    const buttonsImageURL = 'https://ak.picdn.net/shutterstock/videos/12523241/thumb/1.jpg'

    switch (message.text) {
        case 'ค้นหา':
            return client.replyMessage(replyToken,
                {
                    "type": "template",
                    "altText": "this is a carousel template",
                    "template": {
                        "type": "carousel",
                        "actions": [],
                        "columns": [
                            {
                                "thumbnailImageUrl": "https://i.pinimg.com/564x/30/c6/7c/30c67c7ff258d37360d35585265badc0.jpg",
                                "text": "บ้าน",
                                "actions": [
                                    {
                                        "type": "message",
                                        "label": "ซื้อบ้าน",
                                        "text": "ซื้อบ้าน"
                                    },
                                    {
                                        "type": "message",
                                        "label": "เช่าบ้าน",
                                        "text": "เช่าบ้าน"
                                    }
                                ]
                            },
                            {
                                "thumbnailImageUrl": "https://i.pinimg.com/564x/43/75/6d/43756d6c0e4b6cab5a4681c4b807529f.jpg",
                                "text": "คอนโด",
                                "actions": [
                                    {
                                        "type": "message",
                                        "label": "ซื้อคอนโด",
                                        "text": "ซื้อคอนโด"
                                    },
                                    {
                                        "type": "message",
                                        "label": "เช่าคอนโด",
                                        "text": "เช่าคอนโด"
                                    }
                                ]
                            }
                        ]
                    }
                }
            )
        case "ซื้อบ้าน":
            return client.replyMessage(replyToken,
                {
                    "type": "template",
                    "altText": "this is a buttons template",
                    "template": {
                        "type": "buttons",
                        "actions": [
                            {
                                "type": "postback",
                                "label": "ไม่เกิน 2 ล้านบาท",
                                "data": "saleHome2m"
                            },
                            {
                                "type": "postback",
                                "label": "2 ล้านบาท - 5 ล้านบาท",
                                "data": "saleHome2m5m"
                            },
                            {
                                "type": "postback",
                                "label": "5 ล้านบาท - 10 ล้านบาท",
                                "data": "saleHome5m10m"
                            },
                            {
                                "type": "postback",
                                "label": "10 ล้านบาทขึ้นไป",
                                "data": "saleHome10m"
                            }
                        ],
                        "title": "ซื้อบ้าน",
                        "text": "กรุณาระบุราคา"
                    }
                }
            )
        case 'เช่าบ้าน':
            return client.replyMessage(replyToken,
                {
                    "type": "template",
                    "altText": "this is a buttons template",
                    "template": {
                        "type": "buttons",
                        "actions": [
                            {
                                "type": "postback",
                                "label": "ไม่เกิน 5,000 บาท",
                                "data": "rentHome5"
                            },
                            {
                                "type": "postback",
                                "label": "5,001 - 10,000 บาท",
                                "data": "rentHome510"
                            },
                            {
                                "type": "postback",
                                "label": "10,001 - 30,000 บาท",
                                "data": "rentHome1030"
                            },
                            {
                                "type": "postback",
                                "label": "30,001 บาทขึ้นไป",
                                "data": "rentHome3"
                            }
                        ],
                        "title": "เช่าบ้าน",
                        "text": "กรุณาระบุราคา"
                    }
                }
            )
        case 'ซื้อคอนโด':
            return client.replyMessage(replyToken,
                {
                    "type": "template",
                    "altText": "this is a buttons template",
                    "template": {
                        "type": "buttons",
                        "actions": [
                            {
                                "type": "postback",
                                "label": "ไม่เกิน 2 ล้านบาท",
                                "data": "saleCondo2m"
                            },
                            {
                                "type": "postback",
                                "label": "2 ล้านบาท - 5 ล้านบาท",
                                "data": "saleCondo2m5m"
                            },
                            {
                                "type": "postback",
                                "label": "5 ล้านบาท - 10 ล้านบาท",
                                "data": "saleCondo5m10m"
                            },
                            {
                                "type": "postback",
                                "label": "10 ล้านบาทขึ้นไป",
                                "data": "saleCondo10m"
                            }
                        ],
                        "title": "ซื้อคอนโด",
                        "text": "กรุณาระบุราคา"
                    }
                }
            )
        case 'เช่าคอนโด':
            return client.replyMessage(replyToken,
                {
                    "type": "template",
                    "altText": "this is a buttons template",
                    "template": {
                        "type": "buttons",
                        "actions": [
                            {
                                "type": "postback",
                                "label": "ไม่เกิน 5,000 บาท",
                                "data": "rentCondo5"
                            },
                            {
                                "type": "postback",
                                "label": "5,001 - 10,000 บาท",
                                "data": "rentCondo510"
                            },
                            {
                                "type": "postback",
                                "label": "10,001 - 30,000 บาท",
                                "data": "rentCondo1030"
                            },
                            {
                                "type": "postback",
                                "label": "30,001 บาทขึ้นไป",
                                "data": "rentCondo3"
                            }
                        ],
                        "title": "เช่าคอนโด",
                        "text": "กรุณาระบุราคา"
                    }
                }
            )
        // case "ค้นหา":
        //     return client.replyMessage(replyToken, {
        //         type: 'text',
        //         text: 'กรุณาเลือกประเภท',
        //         quickReply: {
        //             items: [
        //                 {
        //                     type: "action", // ③
        //                     // imageUrl: "https://example.com/sushi.png",
        //                     action: {
        //                         type: "message",
        //                         label: "ซื้อบ้าน",
        //                         // data: "ซื้อบ้าน",
        //                         text: 'ซื้อบ้าน'
        //                     }
        //                 },
        //                 {
        //                     type: "action", // ③
        //                     // imageUrl: "https://example.com/sushi.png",
        //                     action: {
        //                         type: "message",
        //                         label: "เช่าบ้าน",
        //                         // data: "เช่าบ้าน",
        //                         text: 'เช่าบ้าน'
        //                     }
        //                 },
        //                 {
        //                     type: "action", // ③
        //                     // imageUrl: "https://example.com/sushi.png",
        //                     action: {
        //                         type: "message",
        //                         label: "ซื้อคอนโด",
        //                         // data: "ซื้อคอนโด",
        //                         text: 'ซื้อคอนโด'
        //                     }
        //                 },
        //                 {
        //                     type: "action", // ③
        //                     // imageUrl: "https://example.com/sushi.png",
        //                     action: {
        //                         type: "message",
        //                         label: "เช่าคอนโด",
        //                         // data: "เช่าคอนโด",
        //                         text: 'เช่าคอนโด'
        //                     }
        //                 },


        //             ]
        //         }
        //     })
        case 'profile':
            if (source.userId) {
                return client.getProfile(source.userId)
                    .then((profile) => replyText(
                        replyToken,
                        [
                            `Display name: ${profile.displayName}`,
                            `Status message: ${profile.statusMessage}`,
                        ]
                    ));
            } else {
                return replyText(replyToken, 'Bot can\'t use profile API without user ID');
            }
        case 'buttons':
            return client.replyMessage(
                replyToken,
                {
                    type: 'template',
                    altText: 'Buttons alt text',
                    template: {
                        type: 'buttons',
                        thumbnailImageUrl: buttonsImageURL,
                        title: 'My button sample',
                        text: 'Hello, my button',
                        actions: [
                            { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
                            { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                            { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
                            { label: 'Say message', type: 'message', text: 'Rice=米' },
                        ],
                    },
                }
            );
        case 'confirm':
            return client.replyMessage(
                replyToken,
                {
                    type: 'template',
                    altText: 'Confirm alt text',
                    template: {
                        type: 'confirm',
                        text: 'Do it?',
                        actions: [
                            { label: 'Yes', type: 'message', text: 'Yes!' },
                            { label: 'No', type: 'message', text: 'No!' },
                        ],
                    },
                }
            )
        case '123':
            return client.replyMessage(replyToken, {
                "type": "template",
                "altText": "this is a carousel template",
                "template": {
                    "type": "carousel",
                    "columns": [
                        {
                            "thumbnailImageUrl": "https://example.com/bot/images/item1.jpg",
                            "imageBackgroundColor": "#FFFFFF",
                            "title": "this is menu",
                            "text": "description",
                            "defaultAction": {
                                "type": "uri",
                                "label": "View detail",
                                "uri": "http://example.com/page/123"
                            },
                            "actions": [
                                {
                                    "type": "postback",
                                    "label": "Buy",
                                    "data": "action=buy&itemid=111"
                                },
                                {
                                    "type": "postback",
                                    "label": "Add to cart",
                                    "data": "action=add&itemid=111"
                                },
                                {
                                    "type": "uri",
                                    "label": "View detail",
                                    "uri": "http://example.com/page/111"
                                }
                            ]
                        },
                        {
                            "thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
                            "imageBackgroundColor": "#000000",
                            "title": "this is menu",
                            "text": "description",
                            "defaultAction": {
                                "type": "uri",
                                "label": "View detail",
                                "uri": "http://example.com/page/222"
                            },
                            "actions": [
                                {
                                    "type": "postback",
                                    "label": "Buy",
                                    "data": "action=buy&itemid=222"
                                },
                                {
                                    "type": "postback",
                                    "label": "Add to cart",
                                    "data": "action=add&itemid=222"
                                },
                                {
                                    "type": "uri",
                                    "label": "View detail",
                                    "uri": "http://example.com/page/222"
                                }
                            ]
                        }
                    ],
                    "imageAspectRatio": "rectangle",
                    "imageSize": "cover"
                }
            }
            );
        case 'img':
            return client.replyMessage(
                replyToken,
                {
                    type: 'template',
                    altText: 'Image carousel alt text',
                    template: {
                        type: 'image_carousel',
                        columns: [
                            {
                                imageUrl: buttonsImageURL,
                                action: { label: 'Go to LINE', type: 'uri', uri: 'https://line.me' },
                            },
                            {
                                imageUrl: buttonsImageURL,
                                action: { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                            },
                            {
                                imageUrl: buttonsImageURL,
                                action: { label: 'Say message', type: 'message', text: 'Rice=米' },
                            },
                            {
                                imageUrl: buttonsImageURL,
                                action: {
                                    label: 'datetime',
                                    type: 'datetimepicker',
                                    data: 'DATETIME',
                                    mode: 'datetime',
                                },
                            },
                        ]
                    },
                }
            );
        case 'datetime':
            return client.replyMessage(
                replyToken,
                {
                    type: 'template',
                    altText: 'Datetime pickers alt text',
                    template: {
                        type: 'buttons',
                        text: 'Select date / time !',
                        actions: [
                            { type: 'datetimepicker', label: 'date', data: 'DATE', mode: 'date' },
                            { type: 'datetimepicker', label: 'time', data: 'TIME', mode: 'time' },
                            { type: 'datetimepicker', label: 'datetime', data: 'DATETIME', mode: 'datetime' },
                        ],
                    },
                }
            );
        case 'imagemap':
            return client.replyMessage(
                replyToken,
                {
                    type: 'imagemap',
                    baseUrl: `${baseURL}/static/rich`,
                    altText: 'Imagemap alt text',
                    baseSize: { width: 1040, height: 1040 },
                    actions: [
                        { area: { x: 0, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/manga/en' },
                        { area: { x: 520, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/music/en' },
                        { area: { x: 0, y: 520, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/play/en' },
                        { area: { x: 520, y: 520, width: 520, height: 520 }, type: 'message', text: 'URANAI!' },
                    ],
                    video: {
                        originalContentUrl: `${baseURL}/static/imagemap/video.mp4`,
                        previewImageUrl: `${baseURL}/static/imagemap/preview.jpg`,
                        area: {
                            x: 280,
                            y: 385,
                            width: 480,
                            height: 270,
                        },
                        externalLink: {
                            linkUri: 'https://line.me',
                            label: 'LINE'
                        }
                    },
                }
            );
        case 'bubble':
            return client.replyMessage(replyToken,
                {
                    "type": "bubble",
                    "header": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "text": "Header text"
                            }
                        ]
                    },
                    "hero": {
                        "type": "image",
                        "url": "https://example.com/flex/images/image.jpg"
                    },
                    "body": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "text": "Body text"
                            }
                        ]
                    },
                    "footer": {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                            {
                                "type": "text",
                                "text": "Footer text"
                            }
                        ]
                    },
                    "styles": {
                        "comment": "See the example of a bubble style object"
                    }
                })
        case 'bye':
            switch (source.type) {
                case 'user':
                    return replyText(replyToken, 'Bot can\'t leave from 1:1 chat');
                case 'group':
                    return replyText(replyToken, 'Leaving group')
                        .then(() => client.leaveGroup(source.groupId));
                case 'room':
                    return replyText(replyToken, 'Leaving room')
                        .then(() => client.leaveRoom(source.roomId));
            }
        default:
            console.log(`Echo message to ${replyToken}: ${message.text}`);
            return replyText(replyToken, message.text);
    }

}

const handleLocation = (message, replyToken) => {

}

const handleSticker = (message, replyToken) => {

}

const handleAudio = (message, replyToken) => {

}

function handleImage(message, replyToken) {
    let getContent;
    if (message.contentProvider.type === "line") {
        const downloadPath = path.join(__dirname, 'downloaded', `${message.id}.jpg`);
        const previewPath = path.join(__dirname, 'downloaded', `${message.id}-preview.jpg`);

        getContent = downloadContent(message.id, downloadPath)
            .then((downloadPath) => {
                // ImageMagick is needed here to run 'convert'
                // Please consider about security and performance by yourself
                cp.execSync(`convert -resize 240x jpeg:${downloadPath} jpeg:${previewPath}`);

                return {
                    originalContentUrl: baseURL + '/downloaded/' + path.basename(downloadPath),
                    previewImageUrl: baseURL + '/downloaded/' + path.basename(previewPath),
                };
            });
    } else if (message.contentProvider.type === "external") {
        getContent = Promise.resolve(message.contentProvider);
    }

    return getContent
        .then(({ originalContentUrl, previewImageUrl }) => {
            return client.replyMessage(
                replyToken,
                {
                    type: 'image',
                    originalContentUrl,
                    previewImageUrl,
                }
            );
        });
}


function downloadContent(messageId, downloadPath) {
    return client.getMessageContent(messageId)
        .then((stream) => new Promise((resolve, reject) => {
            const writable = fs.createWriteStream(downloadPath);
            stream.pipe(writable);
            stream.on('end', () => resolve(downloadPath));
            stream.on('error', reject);
        }));
}


const handleVideo = (message, replyToken) => {

}


module.exports = webhook



// jwt = require('jsonwebtoken'),
// jwkToPem = require("jwk-to-pem");

// const file = require('../private-key-undefined.json')
// const jwk = file.privateKey

// const publicKey = jwkToPem(jwk);
// const privateKey = jwkToPem(jwk, { private: true });

// const header = {
// alg: "RS256",
// typ: "JWT",
// kid: "b37e941c-9953-4678-914f-920b5abb103c",
// };


// const payload = {
// token_exp: 60 * 60 * 48,
// };

// const token = jwt.sign(payload, privateKey, {
// algorithm: "RS256",
// issuer: "1654342722",
// subject: "1654342722",
// audience: "https://api.line.me/",
// expiresIn: "60m",
// noTimestamp: true,
// header: header,
// });

// // console.log(publicKey);
// // console.log(token);

// const x = request({
// uri: 'https://api.line.me/oauth2/v2.1/token',
// headers: {
//     'Content-Type': 'application/x-www-form-urlencoded'
// },
// formData: {
//     grant_type: 'client_credentials',
//     client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
//     client_assertion: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImIzN2U5NDFjLTk5NTMtNDY3OC05MTRmLTkyMGI1YWJiMTAzYyJ9.eyJ0b2tlbl9leHAiOjE3MjgwMCwiZXhwIjoxNTkzODU3MTYyLCJhdWQiOiJodHRwczovL2FwaS5saW5lLm1lLyIsImlzcyI6IjE2NTQzNDI3MjIiLCJzdWIiOiIxNjU0MzQyNzIyIn0.RA2szFHFcylgF5Yq305w8Y5RVZqgp9DN1kFfJtZLFkYfb3K4ej3rsT1JxbSQhbay2JF23VMflJH2Ai7hptmnoJzfBb1wE03-TKR8EQjHms1FV27kVGO8jeGfRnLlI6YAt8VgzsuBkr8blzqrNnjwOC_hi-nPRqx3tocM6hplXlE6LCvEMYLPmPRoa0NtrYPNRtqAZK-ITAKy5fZGzQvH4n1KxjoEQWUADtrRLTcldbMZtSSBSUardF9jMumWKr6W-CNQuAq_ofXJU_2SpJxBb0l3VycycnG1SHNEKOw7P1dFFOBeVkx5MleJBkovI4Nee5n63gERo_U2NOYlqyhj1w'
// },
// json: true,
// method: 'POST'
// })

// // console.log(x);
// const option = {
// url: 'https://api.line.me/oauth2/v2.1/token',
// headers: {
//     'Content-Type': 'application/x-www-form-urlencoded'
// },
// urlencode: {
//     grant_type: 'client_credentials',
//     client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
//     client_assertion: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImIzN2U5NDFjLTk5NTMtNDY3OC05MTRmLTkyMGI1YWJiMTAzYyJ9.eyJ0b2tlbl9leHAiOjE3MjgwMCwiZXhwIjoxNTkzODU3MTYyLCJhdWQiOiJodHRwczovL2FwaS5saW5lLm1lLyIsImlzcyI6IjE2NTQzNDI3MjIiLCJzdWIiOiIxNjU0MzQyNzIyIn0.RA2szFHFcylgF5Yq305w8Y5RVZqgp9DN1kFfJtZLFkYfb3K4ej3rsT1JxbSQhbay2JF23VMflJH2Ai7hptmnoJzfBb1wE03-TKR8EQjHms1FV27kVGO8jeGfRnLlI6YAt8VgzsuBkr8blzqrNnjwOC_hi-nPRqx3tocM6hplXlE6LCvEMYLPmPRoa0NtrYPNRtqAZK-ITAKy5fZGzQvH4n1KxjoEQWUADtrRLTcldbMZtSSBSUardF9jMumWKr6W-CNQuAq_ofXJU_2SpJxBb0l3VycycnG1SHNEKOw7P1dFFOBeVkx5MleJBkovI4Nee5n63gERo_U2NOYlqyhj1w'
// },
// json: true
// }

// request.post(option, (err, res, body) => {
// if (err) {
//     // return console.log(err);
// }
// // console.log(body);
// })