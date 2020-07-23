const express = require('express'),
    search = express.Router(),
    Home = require('../model/Home'),
    findDistance = require('../model/findDistance')


search.route('/myhome')
    .post(async (req, res) => {

        const homes = await Home.find(this.all)
        // console.log(homes);
        const fPrice = req.body.fPrice
        const ePrice = req.body.ePrice
        const province = req.body.province
        const category = req.body.category
        const name = req.body.name
        const type = req.body.type

        if (fPrice && ePrice && (province) && category) {

            const price = homes.filter(item => {
                if (item.price >= +fPrice && item.price <= +ePrice)
                    return item
            })
            console.log(price);

            const prov = price.filter(item => {
                if (item.province == province)
                    return item
            })
            console.log(prov);

            const okhome = prov.filter(item => {
                if (item.category == category)
                    return item
            })
            console.log("1" + okhome);
            if (okhome.length > 0)
                res.send(okhome)
            else
                res.json({ message: "not found homes" })
            console.log("1");
        }

        else if (name && type && category) {
            const namehome = homes.filter(item => {
                if (item.name == name)
                    return item
            })

            const typehome = namehome.filter(item => {
                if (item.type == type)
                    return item
            })

            const cathome = typehome.filter(item => {
                if (item.category == category)
                    return item
            })

            if (cathome.length > 0)
                res.send(cathome)
            else
                res.json({ message: "not found homes" })
            // console.log(cathome);
            console.log("2");

        }

        else if (fPrice && ePrice && type) {
            const price = homes.filter(item => {
                if (item.price >= +fPrice && item.price <= +ePrice)
                    return item
            })

            const typehome = price.filter(item => {
                if (item.type == type)
                    return item
            })
            if (typehome.length > 0)
                res.send(typehome)
            else
                res.json({ message: "not found homes" })
            console.log("3");

        }

        else {
            res.json({
                message: "parameter incorrect"
            })
        }


    })
//7.004547,100.492221

search.route('/location')
    .post(async (req, res) => {
        const { latitude, longitude } = { ...req.body }

        const homes = await Home.find(this.all)


        var GPS = function (lat, lnt) {
            this.latitude = lat || 0;
            this.longitude = lnt || 0;
        };



        var distance = 0

        const x = homes.filter((item) => {
            var gps1 = new GPS(+latitude, +longitude);
            var gps2 = new GPS(+item.latitude, +item.longitude);


            distance = findDistance(gps1, gps2)
            if (distance > 10980000)
                distance = distance - 10980000
            console.log(distance);

            if (distance < 7000)
                return item
            // nearby.push(item)
        })
        console.log(x);
        // res.send(distance)
        if (x.length > 0)
            res.send(x)
        else
            res.json({ message: "not found homes" })



    })

module.exports = search

