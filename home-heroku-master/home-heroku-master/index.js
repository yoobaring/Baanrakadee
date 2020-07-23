const express = require('express'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    app = express(),
    router = express.Router(),
    mongoose = require('mongoose'),
    dotenv = require('dotenv'),
    morgan = require('morgan')

const myuser = require('./routes/Myuser'),
    rest = require('./routes/Rest'),
    search = require('./routes/Search'),
    db = require('./config/db'),
    webhook = require('./routes/Webhook'),
    image = require('./routes/Image'),
    verifyToken = require('./validator/verifyToken'),
    lineweb = require('./routes/Lineweb')

let port = process.env.PORT || 4444


dotenv.config()
app.use(bodyParser.urlencoded({ extended: false }), router)
app.use(morgan('dev'))
app.use(cors())

// database connect
mongoose.connect(
    process.env.HE_MONGODB_URI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log('connected to db')
);

//route 
app.use('/line', webhook)
app.use(bodyParser.json())

app.use('/api', rest)
app.use('/search', search)
app.use('/user', myuser)
app.use('/uploads', image)
app.use('/newline', lineweb)




app.use("*", (req, res) => res.status(404).send("404 not found"))
app.listen(port, () => {
    console.log("server is ok");

})

//mongodb+srv://newhome:<password>@cluster0-zb5mq.mongodb.net/<dbname>?retryWrites=true&w=majority
//MONGODB_URI = mongodb://heroku_4jkq58pn:6kq1r74ub2cc74m6o7lp7r0bmh@ds243084.mlab.com:43084/heroku_4jkq58pn




