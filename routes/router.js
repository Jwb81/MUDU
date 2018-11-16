const express = require('express');
const request = require('request');
const router = express.Router();
var connection = require("../config/connection.js");
const orm = require('../config/orm');

/**
 * 1. make a request to get the number of pages
 * 2. make a request for each page and add all drinks to an object hosted on the server
 * 3. filter over that array whenever needed
 */
const breweryDbURL = 'https://sandbox-api.brewerydb.com/v2/beers?key=d00fe48488b9bc5528a4f5aab7f5c4ed&withBreweries=Y';
let allBeers = [];

const sleep = (ms) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}
const getBeersFromAPI = new Promise((resolve, reject) => {
    request(breweryDbURL, (err, response, body) => {
        if (err) {
            return reject(err);
        }
        body = JSON.parse(body);
        let pages = body.numberOfPages;
        // console.log(pages);

        let promiseArray = [];

        // for (let i = 1; i <= pages; i++) {
        for (let i = 1; i <= 10; i++) {
            if (pages % 10 === 0) {
                // sleep(1100);
            } 
            promiseArray = promiseArray.concat(new Promise((resolve, reject) => {
                request(`${breweryDbURL}&p=${i}`, (err, response, body) => {
                    // console.log(i);
                    if (err) {
                        return reject(err);
                    }
                    body = JSON.parse(body);
                    if (i === 1) {
                    }
                    // console.log(body.data)
                    resolve(body.data);
                })
            }))
        }

        Promise.all(promiseArray).then(values => {
            // console.log(values);
            for (let i = 0; i < values.length; i++) {
                allBeers = allBeers.concat(values[i]);
            }
            resolve(allBeers);
            // console.log(allBeers.length);
        })
    })
})
.then(result => {
    console.log(result.length);
}) 
.catch(err => {
    console.log(err);
})



router.get('/', (req, res) => {
    res.sendFile('./index.html');
    // res.json({
    //     success: true
    // })
})

router.get('/all-drinking-buddies/:username', (req, res) => {
    const username = req.params.username;

    orm.getDrinkingBuddies(username)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.json(err);
        })
})

router.get('/unmatched-beers/:username', (req, res) => {
    const username = req.params.username;

    orm.getUnmatchedBeers(username, allBeers)
        .then(arr => {
            res.send(arr);
        })
        .catch(err => {
            res.send(err);
        })
})

router.get('/allbeers/:pageNumber', (req, res) => {
    const page = req.params.pageNumber || 1;
    request(`https://sandbox-api.brewerydb.com/v2/beers?key=d00fe48488b9bc5528a4f5aab7f5c4ed&p=${page}&withBreweries=Y`, (err, response, body) => {
        // request(`https://sandbox-api.brewerydb.com/v2/beers?key=d00fe48488b9bc5528a4f5aab7f5c4ed`, (err, response, body) => {
        res.json(JSON.parse(response.body));
        // console.log(body);
    })
})

router.put('/beer-match', (req, res) => {
    const username = req.body.username;
    const beerId = req.body.beer_id;
    const match = req.body.match;

    orm.updateMatch(username, beerId, match)
        .then(response => {
            res.sendStatus(200);
        })
        .catch(err => {

        })
})

router.post('/beer-match', (req, res) => {
    const username = req.body.username;
    const beerId = req.body.beer_id;
    const match = req.body.match;

    orm.addBeerMatch(username, beerId, match)
        .then(response => {
            res.sendStatus(200);
        })
        .catch(err => {

        })
})

module.exports = router;