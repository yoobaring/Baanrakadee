
// const MongoClient = require('mongodb').MongoClient  // ใช้งาน mongodb module

// // const url = 'mongodb://localhost:27017' // กำหนด url สำหรับ MongoDB Server
// const dbName = 'newhome'
// const dotenv = require('dotenv')

// dotenv.config()

// module.exports = new Promise((resolve, reject) => {
//     MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
//         if (error) throw error
//         var db = client.db(dbName)
//         console.log("Connected successfully to server")
//         resolve(db)
//     })
// })

















// const mysql = require('mysql')

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: 'test'
// })

// // db.connect((err) => {
// //     if (err) throw err
// //     else
// //         console.log('connected as id ' + db.threadId);

// // })

// module.exports = db

