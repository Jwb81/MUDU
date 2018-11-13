const express = require('express');
const router = express.Router();
var connection = require("../config/connection.js");
const orm = require('../config/orm');

router.get('/', (req, res) => {
    res.json({
        success: true
    })
})

//get a list of beers form the db
router.get('/beers', (req, res) => {
    res.json(response).catch(err => {
        res.json(err);
        res.send({type: 'GET'});
    })
})

//add new beer into the db
router.post('/beers', (req, res) => {
    res.json(response).catch(err => {
        res.json(err);
        res.send({type: 'POST'});
    })
})

//update a new beers to the db
router.put('/beers/:beerId/name/:name/', (req, res) => {
    res.json(response).catch(err => {
        res.json(err);
        res.send({type: 'PUT'});
    })
})

//delete a beer from the db
router.delete('/beers/:beerId/name/:name', (req, res) => {
    res.json(response).catch(err => {
        res.json(err);
        res.send({type: 'DELETE'});
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

module.exports = router; 