const express = require('express'),
    myuser = express.Router(),
    User = require('../model/User'),
    bcryptjs = require('bcryptjs'),
    { regisValidation, loginValidation } = require('../validator/User_valid'),
    jwt = require('jsonwebtoken')

myuser.route('/register')
    .get((req, res) => {
        res.send("a")
    })
    .post(async (req, res) => {
        console.log(req.body);

        const { error } = regisValidation(req.body)
        if (error) return res.send({ message: error.details[0].message })

        const userExist = await User.findOne({ username: req.body.username })
        if (userExist) return res.send({ message: 'Username already exists' })

        const salt = await bcryptjs.genSalt(10)
        const hashPass = await bcryptjs.hash(req.body.password, salt)

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: hashPass
        })
        try {
            const savedUser = await user.save()
            res.json({
                user_id: user._id,
                message: "register success"
            })
        } catch (err) {
            res.send(err)
        }

    })

myuser.route('/login')
    .post(async (req, res) => {

        const { error } = loginValidation(req.body)
        if (error) res.send({ message: error.details[0].message })

        const user = await User.findOne({ username: req.body.username })
        if (!user) return res.send({ message: "username not found" })

        const validPass = await bcryptjs.compare(req.body.password, user.password)
        if (!validPass) return res.send({ message: "Invalid password" })

        const token = jwt.sign({ username: req.body.username }, process.env.TOKEN_SECRET)
        res.header('auth-token').json({
            token: token,
            message: "login success"
        })
        // res.send("Logged in!")

    })

module.exports = myuser