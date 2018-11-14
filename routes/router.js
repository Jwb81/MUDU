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

module.exports = router; 