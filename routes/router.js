const express = require('express');
const request = require('request');
const router = express.Router();
var connection = require("../config/connection.js");
const orm = require('../config/orm');

// read in all beers from api


router.get('/', (req, res) => {
    res.json({
        success: true
    })
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

    orm.getUnmatchedBeers(username);

})

router.get('/allbeers/:pageNumber', (req, res) => {
    const page = req.params.pageNumber || 1;
    request(`https://sandbox-api.brewerydb.com/v2/beers?key=d00fe48488b9bc5528a4f5aab7f5c4ed&p=${page}`, (err, response, body) => {
    // request(`https://sandbox-api.brewerydb.com/v2/beers?key=d00fe48488b9bc5528a4f5aab7f5c4ed`, (err, response, body) => {
        res.json(JSON.parse(response.body));
        // console.log(body);
    })
})

router.post('/beer-match', (req, res) => {
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

module.exports = router; 