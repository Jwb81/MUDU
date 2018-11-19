const express = require('express');
const request = require('request');
const router = express.Router();
var connection = require("../config/connection.js");
const orm = require('../config/orm');
const fs = require('fs');
const path = require('path');

/**
 * 1. make a request to get the number of pages
 * 2. make a request for each page and add all drinks to an object hosted on the server
 * 3. filter over that array whenever needed
 */
const breweryDbURL = 'https://sandbox-api.brewerydb.com/v2/beers?key=d00fe48488b9bc5528a4f5aab7f5c4ed&withBreweries=Y';
let allBeers = [];

// read in all beer objects from file
const filename = path.join(__dirname, '..', 'public', 'allBeers.js');
fs.readFile(filename, (err, data) => {
    if (err) throw err;

    allBeers = randomizeArray(JSON.parse(data));
    console.log(`First: ${allBeers[0].name}`)
    console.log(`Length: ${allBeers.length}`)
})

// randomize the array so it's not in alphabetical order
const randomizeArray = (beers) => {

    let ctr = beers.length;
    let temp;
    let index;

    // While there are elements in the array
    while (ctr > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * ctr);
        // Decrease ctr by 1
        ctr--;
        // And swap the last element with it
        temp = beers[ctr];
        beers[ctr] = beers[index];
        beers[index] = temp;
    }
    return beers;
}



// const getBeersFromAPI = new Promise((resolve, reject) => {
//         request(breweryDbURL, (err, response, body) => {
//             if (err) {
//                 return reject(err);
//             }
//             body = JSON.parse(body);
//             let pages = body.numberOfPages;
//             // console.log(pages);

//             let promiseArray = [];

//             // for (let i = 1; i <= pages; i++) {
//             for (let i = 21; i <= 23; i++) {

//                 promiseArray = promiseArray.concat(new Promise((resolve, reject) => {
//                     request(`${breweryDbURL}&p=${i}`, (err, response, body) => {
//                         // console.log(i);
//                         if (err) {
//                             return reject(err);
//                         }
//                         body = JSON.parse(body);
//                         if (i === 1) {}
//                         // console.log(body.data)
//                         resolve(body.data);
//                     })
//                 }))
//             }

//             Promise.all(promiseArray).then(values => {
//                 // console.log(values);
//                 let tempBeerArr = [];
//                 for (let i = 0; i < values.length; i++) {
//                     tempBeerArr = tempBeerArr.concat(values[i]);
//                 }

//                 // read in beer array from file
//                 const filename = path.join(__dirname, '..', 'public', 'allBeers.js');
//                 fs.readFile(filename, 'utf8', (err, data) => {

//                     allBeers = JSON.parse(data);
//                     console.log('length: ' + Object.keys(allBeers).length)

//                     // append new beers
//                     allBeers = allBeers.concat(tempBeerArr);

//                     // write beers out
//                     fs.writeFile(__dirname + '/../public/allBeers.js', JSON.stringify(allBeers), err => {
//                         if (err) throw err;
//                         console.log('write success');
//                     });
//                 })



//                 resolve(allBeers);
//                 // console.log(allBeers.length);
//             })
//         })
//     })
//     .then(result => {
//         console.log(result.length);
//     })
//     .catch(err => {
//         console.log(err);
//     })



router.get('/', (req, res) => {
    res.sendFile('./index.html');
    // res.json({
    //     success: true
    // })
})

router.get('/', (req,res) => {
    res.sendFile('./main.html');
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

router.get('/matched-beers/:username', (req, res) => {
    const username = req.params.username;
    orm.getBeerMatches(username)
        .then(results => {
            // filter only true matches
            const matches = results.data.filter(x => x.matched)

            // go through each match and get the full obj
            const fullMatchObjArr = matches.map(match => {
                // search for the full object in allBeers
                return allBeers.find(function (obj) {
                    return obj.id === match.beer_id
                });
            })
            res.json(fullMatchObjArr);
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

    orm.updateBeerMatch(username, beerId, match)
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