const express = require('express');
const request = require('request');
const router = express.Router();
var connection = require("../config/connection.js");
const orm = require('../config/orm');

router.get('/', (req, res) => {
    res.json({
        success: true
    })
})

router.get('/all-drinking-buddies', (req, res) => {
    orm.getDrinkingBuddies()
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.json(err);
        })
})

router.get('/allbeers/:pageNumber', (req, res) => {
    const page = req.params.pageNumber || 1;
    request(`https://sandbox-api.brewerydb.com/v2/beers?key=d00fe48488b9bc5528a4f5aab7f5c4ed&p=${page}`, (err, response, body) => {
    // request(`https://sandbox-api.brewerydb.com/v2/beers?key=d00fe48488b9bc5528a4f5aab7f5c4ed`, (err, response, body) => {
        res.json(JSON.parse(response.body));
        // console.log(body);
    })
})

module.exports = router; 