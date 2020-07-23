const express = require('express');
const app = express();
const request = require('request')
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 4000;
const fetch = require('cross-fetch')

const ACCESS_TOKEN = 'wFkbM2s/yZ1omg++gj+3C/IyFup1n7e7fGG5wAHGxzrxtRWkOgERzmkiEUrlLeuOBk0reNrHWgsfEw8H8jJEt0/1XubDvHQAsIlehGtBQN1n6V0Crc8k/HCxyMI9FTB1IXwtlhK2wz85FAu6Ba+OvQdB04t89/1O/w1cDnyilFU='
const defaultHeader = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}
const API_BACKEND = {
    SEARCH_LOCATION: 'https://ok-myhome.herokuapp.com/search/location',
    SEARCH: 'https://ok-myhome.herokuapp.com/search/myhome'
}

app.use(morgan('dev'))
app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.send({
        success: true
    });
})

app.post('/line/webhook', (req, res) => {
    // req.body.events should be an array of events
    if (!Array.isArray(req.body.events)) {
        return res.status(500).end();
    }
    // handle events separately
    Promise.all(req.body.events.map(event => {
        console.log('event', event);
        // check verify webhook event
        if (event.replyToken === '00000000000000000000000000000000' ||
            event.replyToken === 'ffffffffffffffffffffffffffffffff') {
            return;
        }
        return handleEvent(event);
    }))
        .then(() => res.end())
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });

    res.sendStatus(200)
})

const handleEvent = async (event) => {

    if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
        return console.log('Test hook recieved: ' + JSON.stringify(event.message));
    }
    // console.log(event);

    switch (event.type) {
        case 'message':
            const sender = event.source.userId
            const message = event.message;
            switch (message.type) {
                case 'text':
                    let messageTemplate = await handleText(sender, message)
                    return sendMessageToLine(messageTemplate)
                // case 'image':
                //     return handleImage(message, event.replyToken);
                // case 'video':
                //     return handleVideo(message, event.replyToken);
                // case 'audio':
                //     return handleAudio(message, event.replyToken);
                case 'location':
                    let messageLocation = await handleLocation(sender, message);
                    return sendMessageToLine(messageLocation)
                // case 'sticker':
                //     return handleSticker(message, event.replyToken);
                default:
                    throw new Error(`Unknown message: ${JSON.stringify(message)}`);
            }
    }
}

const handleText = async (sender, data) => {
    let message
    let rateArray = ['<2000000', '2000000-5000000', '5000000-10000000', '>10000000', '<5000', '5001-10000', '10001-30000', '>30000'];
    if (data.text === 'ค้นหาบ้านและคอนโด') {
        message = {
            to: sender,
            messages: [
                {
                    'text': 'กรุณาเลือกประเภทที่ต้องการค้นหา',
                    'quickReply': {
                        'items': [
                            {
                                'type': 'action',
                                'action': {
                                    'type': 'message',
                                    'label': 'ค้นหาโดยราคา',
                                    'text': 'ค้นหาโดยราคา'
                                }
                            },
                            {
                                'type': 'action',
                                'action': {
                                    'label': 'ค้นหาโดยโลเคชั่น คลิกที่นี่',
                                    'type': 'location'
                                }
                            }
                        ]
                    },
                    'type': 'text'
                }
            ]
        }
    } else if (data.text === 'ค้นหาโดยราคา') {
        message = {
            to: sender,
            messages: [
                {
                    'contents': {
                        'contents': [
                            {
                                'body': {
                                    'spacing': 'md',
                                    'layout': 'vertical',
                                    'type': 'box',
                                    'contents': [
                                        {
                                            'wrap': true,
                                            'weight': 'bold',
                                            'type': 'text',
                                            'align': 'start',
                                            'size': 'xl',
                                            'text': 'ประเภทขาย'
                                        },
                                        {
                                            'layout': 'baseline',
                                            'contents': [
                                                {
                                                    'type': 'text',
                                                    'weight': 'regular',
                                                    'text': 'กรุณาเลือกช่วงราคาด้วยค่ะ',
                                                    'align': 'start'
                                                }
                                            ],
                                            'type': 'box'
                                        },
                                        {
                                            'type': 'text',
                                            'size': 'sm',
                                            'color': '#F06060',
                                            'text': '- ไม่เกิน 2,000,000 บาท',
                                            'wrap': true,
                                            'action': {
                                                'type': 'message',
                                                'text': '<2000000',
                                                'label': 'ไม่เกิน 2,000,000 บาท'
                                            },
                                            'margin': 'md'
                                        },
                                        {
                                            'color': '#F06060',
                                            'size': 'sm',
                                            'wrap': true,
                                            'text': '- ราคา 2 ล้าน - 5 ล้าน',
                                            'margin': 'md',
                                            'action': {
                                                'type': 'message',
                                                'label': 'ราคา 2 ล้าน - 5 ล้าน',
                                                'text': '2000000-5000000'
                                            },
                                            'type': 'text'
                                        },
                                        {
                                            'type': 'text',
                                            'size': 'sm',
                                            'wrap': true,
                                            'text': '- ราคา 5 ล้าน - 10 ล้าน',
                                            'color': '#F06060',
                                            'action': {
                                                'text': '5000000-10000000',
                                                'label': 'ราคา 5 ล้าน - 10 ล้าน',
                                                'type': 'message'
                                            },
                                            'margin': 'md'
                                        },
                                        {
                                            'margin': 'md',
                                            'type': 'text',
                                            'wrap': true,
                                            'size': 'sm',
                                            'text': '- 10,000,000 ล้านบาทขึ้นไป',
                                            'action': {
                                                'label': '10,000,000 ล้านบาทขึ้นไป',
                                                'type': 'message',
                                                'text': '>10000000'
                                            },
                                            'color': '#F06060'
                                        }
                                    ]
                                },
                                'footer': {
                                    'type': 'box',
                                    'contents': [
                                        {
                                            'size': 'xs',
                                            'type': 'spacer'
                                        }
                                    ],
                                    'layout': 'vertical',
                                    'spacing': 'sm'
                                },
                                'type': 'bubble',
                                'hero': {
                                    'url': 'https://www.lh.co.th/www_th/Backend/fileupload/images/project_img/LD_26092019170711548317264.jpg',
                                    'aspectRatio': '20:13',
                                    'size': 'full',
                                    'aspectMode': 'cover',
                                    'type': 'image'
                                }
                            },
                            {
                                'body': {
                                    'contents': [
                                        {
                                            'size': 'xl',
                                            'type': 'text',
                                            'align': 'start',
                                            'weight': 'bold',
                                            'text': 'ประเภทเช่า',
                                            'wrap': true
                                        },
                                        {
                                            'type': 'box',
                                            'contents': [
                                                {
                                                    'text': 'กรุณาเลือกช่วงราคาด้วยค่ะ',
                                                    'align': 'start',
                                                    'weight': 'regular',
                                                    'type': 'text'
                                                }
                                            ],
                                            'layout': 'baseline'
                                        },
                                        {
                                            'action': {
                                                'text': '<5000',
                                                'type': 'message',
                                                'label': 'ไม่เกิน 5,000 บาท'
                                            },
                                            'size': 'sm',
                                            'text': '- ไม่เกิน 5,000 บาท',
                                            'margin': 'md',
                                            'wrap': true,
                                            'type': 'text',
                                            'color': '#F06060'
                                        },
                                        {
                                            'margin': 'md',
                                            'type': 'text',
                                            'color': '#F06060',
                                            'wrap': true,
                                            'size': 'sm',
                                            'action': {
                                                'text': '5001-10000',
                                                'type': 'message',
                                                'label': 'ราคา 2 ล้าน - 5 ล้าน'
                                            },
                                            'text': '- ราคา 5,001 - 10,000'
                                        },
                                        {
                                            'color': '#F06060',
                                            'type': 'text',
                                            'action': {
                                                'type': 'message',
                                                'text': '10001-30000',
                                                'label': 'ราคา 10,001 - 30,000'
                                            },
                                            'size': 'sm',
                                            'margin': 'md',
                                            'text': '- ราคา 10,001 - 30,000',
                                            'wrap': true
                                        },
                                        {
                                            'margin': 'md',
                                            'color': '#F06060',
                                            'wrap': true,
                                            'type': 'text',
                                            'action': {
                                                'text': '>30000',
                                                'type': 'message',
                                                'label': '30,000 บาทขึ้นไป'
                                            },
                                            'size': 'sm',
                                            'text': '- 30,000 บาทขึ้นไป'
                                        }
                                    ],
                                    'layout': 'vertical',
                                    'type': 'box',
                                    'spacing': 'sm'
                                },
                                'hero': {
                                    'size': 'full',
                                    'aspectMode': 'cover',
                                    'type': 'image',
                                    'aspectRatio': '20:13',
                                    'url': 'https://s3-ap-southeast-1.amazonaws.com/o77site/dcondo-ramkanhaeng40-condominium-landscape-935x745.jpg'
                                },
                                'footer': {
                                    'spacing': 'sm',
                                    'type': 'box',
                                    'contents': [
                                        {
                                            'size': 'xs',
                                            'type': 'spacer'
                                        }
                                    ],
                                    'layout': 'vertical'
                                },
                                'type': 'bubble'
                            }
                        ],
                        'type': 'carousel'
                    },
                    'type': 'flex',
                    'altText': 'กรุณาเลือกราคาที่ต้องการค้นหา'
                }
            ]
        }
    } else if (data.text === 'เช็คราคาค่าเช่าคอนโด') {
        message = {
            to: sender,
            messages: [
                {
                    type: 'text',
                    text: `กรุณาพิมพ์ชื่อคอนโดที่ต้องการเช็ค`
                },
                {
                    type: 'text',
                    text: `ตัวอย่างในการพิมพ์เช่น หากต้องการเช็คราคาศุภาลัยให้พิมพ์ว่า คอนโดศุภาลัย`
                }
            ]
        }
    } else if ((data.text).includes('คอนโด')) {
        let condoName = (data.text).replace('คอนโด', '').trim();
        const body = {
            name: condoName,
            type: 'rent',
            category: 'condo'
        }

        const result = await post(API_BACKEND.SEARCH, body)

        const template = generateCarouselTemplateProperty('ผลลัพธ์การเช็คราคาค่าเช่าคอนโด', result)

        message = {
            to: sender,
            messages: [ template ]
        }
    }  else if (rateArray.indexOf(data.text) > -1) {
        const template = await findByRate(data.text)

        message = {
            to: sender,
            messages: [ template ]
        }
    } else {
        let messageError = ['ฉันไม่เข้าใจค่ะ พูดใหม่ได้ไหมคะ', 'อะไรนะคะ พูดใหม่ได้ไหมคะ', 'ขอโทษค่ะ ลองพูดอีกครั้งได้ไหมคะ', 'ว่ายังไงนะคะ', 'ฉันไม่เข้าใจค่ะ', 'ฉันฟังไม่ทันค่ะ', 'ฉันไม่เข้าใจค่ะ'];

        let error = messageError[Math.floor(Math.random() * messageError.length)];

        message = {
            to: sender,
            messages: [
                {
                    type: 'text',
                    text: `${error}`
                }
            ]
        }
    }

    return message
}

const handleLocation = async (sender, data) => {
    const body = {
        latitude: data.latitude,
        longitude: data.longitude
    }

    const result = await post(API_BACKEND.SEARCH_LOCATION, body)

    const template = generateCarouselTemplateProperty('ผลลัพธ์การค้นหาโดยตำแหน่งที่ตั้ง', result)

    let message = {
        to: sender,
        messages: [ template ]
    }

    return message
}

const findByRate = async (rate) => {
    let rateRentArray = ['<5000', '5001-10000', '10001-30000', '>30000']
    let fPrice = "0"
    let ePrice = "0"

    if (rate.includes('-')) {
        fPrice = rate.split('-')[0];
        ePrice = rate.split('-')[1]
    } else if (rate.includes('<')) {
        let newRate = rate.replace('<', '')
        ePrice = newRate
    } else if (rate.includes('>')) {
        let newRate = rate.replace('>', '')
        fPrice = newRate
        ePrice = 20000000
    }

    let type = (rateRentArray.indexOf(rate) > -1) ? 'rent' : 'sale'
    const body = {
        fPrice: fPrice,
        ePrice: ePrice,
        type: type
    }

    const result = await post(API_BACKEND.SEARCH, body)
    const template = generateCarouselTemplateProperty('ผลลัพธ์การค้นหาโดยราคา', result)
    console.log('result = ',result)
    return template

}

const post = async (url, data, headers = {}) => {
    try {
        const res = await _fetchData('POST', url, data, headers)

        return res
    } catch (err) {
        throw err
    }
}

const _fetchData = async (method, url, data, headers = {}) => {
    const request = {
        method: method
    }

    const headersData = Object.assign({}, defaultHeader, headers)
    request.headers = headersData

    request.body = (data !== undefined) ? JSON.stringify(data) : undefined

    const res = await fetch(url, request)
    const result = await res.json()

    return result
}

function generateCarouselTemplateProperty (text, result) {
    let responsePayload
    if ((result.message) && (result.message).includes('not found homes') && text.includes('ผลลัพธ์การค้นหาโดยตำแหน่งที่ตั้ง')) {
        responsePayload = {
            'text': 'ไม่พบคอนโดในบริเวณใกล้เคียง กรุณาแชร์โลเคชั่นใหม่ค่ะ',
            'quickReply': {
                'items': [
                    {
                        'type': 'action',
                        'action': {
                            'label': 'แชร์โลเคชั่น คลิกที่นี่ค่ะ',
                            'type': 'location'
                        }
                    }
                ]
            },
            'type': 'text'
        }

        return responsePayload
    } else if ((result.message) && (result.message).includes('not found homes') && text.includes('ผลลัพธ์การเช็คราคาค่าเช่าคอนโด')) {
        responsePayload = {
            type: 'text',
            text: `ไม่พบผลลัพท์ที่ต้องการหา กรุณาพิมพ์ชื่อคอนโดใหม่`
        }

        return responsePayload
    } else if ((result.message) && (result.message).includes('not found homes') && text.includes('ผลลัพธ์การค้นหาโดยราคา')) {
        responsePayload = {
            type: 'text',
            text: `ไม่พบผลลัพท์ที่ต้องการหา กรุณาเลือกช่วงราคาใหม่`
        }

        return responsePayload
    }

    let arr = []
    let length = result.length > 10 ? 9 : result.length
    for (let index = 0; index < length; index++ ) {
        let element = result[index]

        let flexContent = {
            'hero': {
                'url': 'https://www.supalai.com/media/project_home_ads_gallery/168/6_cover.jpg?1532503426',
                'size': 'full',
                'type': 'image',
                'aspectMode': 'cover',
                'aspectRatio': '20:13'
            },
            'type': 'bubble',
            'footer': {
                'contents': [
                    {
                        'type': 'separator'
                    },
                    {
                        'type': 'button',
                        'action': {
                            'label': 'รายละเอียด',
                            'type': 'uri',
                            'uri': 'https://linecorp.com'
                        }
                    }
                ],
                'spacing': 'sm',
                'layout': 'vertical',
                'type': 'box'
            },
            'body': {
                'spacing': 'sm',
                'contents': [
                    {
                        'weight': 'bold',
                        'wrap': true,
                        'type': 'text',
                        'size': 'xl',
                        'align': 'start',
                        'text': element.name
                    },
                    {
                        'contents': [
                            {
                                'type': 'text',
                                'weight': 'regular',
                                'align': 'start',
                                'text': `ราคา ${numberWithCommas(element.price)} ฿ (ประเภท${element.type})`
                            }
                        ],
                        'layout': 'baseline',
                        'type': 'box'
                    },
                    {
                        'text': `* ${element.des}`,
                        'gravity': 'center',
                        'type': 'text',
                        'size': 'sm',
                        'align': 'start',
                        'color': '#F06060',
                        'margin': 'md',
                        'wrap': true
                    },
                    {
                        'size': 'sm',
                        'type': 'text',
                        'text': `หมวดหมู่อสังหา: ${element.category}`,
                        'color': '#4c4e51'
                    },
                    {
                        'size': 'sm',
                        'type': 'text',
                        'text': `ตำแหน่งที่ตั้งของโครงการ: ${element.province}`,
                        'color': '#4c4e51'
                    },
                    {
                        'size': 'sm',
                        'type': 'text',
                        'text': `เบอร์โทร: ${element.tel}`,
                        'color': '#4c4e51'
                    }
                ],
                'type': 'box',
                'layout': 'vertical'
            }
        }

        arr.push(flexContent)
    }

    let template = [];

    template['type'] = 'flex'
    template['altText'] = text
    template['contents'] = {
        type: 'carousel',
        contents: arr
    }

    responsePayload = Object.assign({}, template);

    console.log('Response:', responsePayload)

    return responsePayload

}

function sendMessageToLine (message) {
    request({
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ACCESS_TOKEN}`
        },
        url: 'https://api.line.me/v2/bot/message/push',
        method: 'POST',
        body: message,
        json: true
    }, function (err, res, body) {
        if (err) console.log('error')
        if (res) console.log('success')
        if (body) console.log(body)
    })

}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`);
});
