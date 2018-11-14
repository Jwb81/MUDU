const express = require('express');
const request = require('request');
const router = express.Router();

const orm = require('../config/orm');

router.get('/', (req, res) => {
    res.json({
        success: true
    })
})

router.get('/all-drinking-buddies', (req, res) => {
    orm.getAllDrinkingBuddies()
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.json(err);
        })
})

router.get('/beer', (req, res) => {
    request('https://sandbox-api.brewerydb.com/v2/beers?key=d00fe48488b9bc5528a4f5aab7f5c4ed', (err, response, body) => {
        res.send(body.currentPage);
        // console.log(body);
    })
})

module.exports = router; 