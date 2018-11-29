const express = require('express');
const request = require('request');
const router = express.Router();
// var connection = require("../config/connection.js");
const orm = require('../config/orm');
const fs = require('fs');
const path = require('path');

const K = require('kyanite');


/**
 * 1. make a request to get the number of pages
 * 2. make a request for each page and add all drinks to an object hosted on the server
 * 3. filter over that array whenever needed
 */
const breweryDbURL = 'https://sandbox-api.brewerydb.com/v2/beers?key=d00fe48488b9bc5528a4f5aab7f5c4ed&withBreweries=Y';
let allBeers = [];

// read in all beer objects from file
const filename = path.join(__dirname, '..', 'public', 'javascript', 'allBeers.json');
fs.readFile(filename, (err, data) => {
    if (err) throw err;

    allBeers = randomizeArray(JSON.parse(data));

    // sort by beers with pictures first
    const beerWithImages = K.filter(obj => {
        return obj.labels != undefined;
    }, allBeers);

    const beerWithoutImages = K.filter(obj => {
        return obj.labels == undefined;
    }, allBeers);
    
    allBeers = [];
    allBeers = allBeers.concat(beerWithImages);
    allBeers = allBeers.concat(beerWithoutImages);


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


router.get('/user/:username', (req, res) => {
    const username = req.params.username;

    orm.findUser(username)
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            res.json(err);
        })
})

router.post('/new-user', (req, res) => {
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const username = req.body.username;
    const email = req.body.email;
    const age = req.body.age;

    orm.addUser(firstName, lastName, username, email, age)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.json(err);
        })
})

router.get('/drinking-buddies/:username', (req, res) => {
    const username = req.params.username;

    if (!username) {
        return res.send('no username given');
    }

    orm.getDrinkingBuddies(username)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.json(err);
        })
})

router.put('/drinking-buddies', (req, res) => {
    const username = req.body.username;

    if (!username) {
        return res.send('no username given');
    }

    orm.setDrinkingBuddies(username)
        .then(response => {
            res.json(response);
        })
        .catch(err => {

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
                    return obj.id == match.beer_id;
                });
            })

            // filter out any null objects (used in testing)
            // fullMatchObjArr = fullMatchObjArr.filter(obj => obj);

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

router.get('/chat-key/:me/:them', (req, res) => {
    const me = req.params.me;
    const them = req.params.them;

    orm.getChatKey(me, them)
        .then(result => {
            res.json({
                success: true,
                chat_key: result.data.chat_key
            })
        })
        .catch(err => {
            res.json(err);
        })
})

router.put('/chat-key', (req, res) => {
    const me = req.body.me;
    const them = req.body.them;
    const chatKey = req.body.chat_key;

    if (!me || !them) {
        return res.send('need both usernames');
    }

    orm.getChatKey(me, them)
        .then(result => {
            // now update that pairing with the usernames
            result = result.data;
            orm.updateChatKey(result.username1, result.username2, chatKey)
                .then(response => {
                    res.json(response);
                })
                .catch(err => {
                    res.json(err);
                })
        })
        .catch(err => {
            res.json(err);
        })
})

router.put('/beer-match', (req, res) => {
    const username = req.body.username;
    const beerId = req.body.beer_id;
    const match = req.body.match;

    console.log(username);
    if (!username) {
        return res.send('no username')
    }

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


router.get('/app', (req, res) => {
    const url = path.join(__dirname, '..', 'public', 'html', 'app.html');
    res.sendFile(url);
})

router.get('/chat', (req, res) => {
    const url = path.join(__dirname, '..', 'public', 'html', 'chat.html');
    res.sendFile(url);
})

router.get('*', (req, res) => {
    const url = path.join(__dirname, '..', 'public', 'html', 'login.html');
    res.sendFile(url);
})

module.exports = router;