// bring in the dependencies
const express = require('express');
const path = require('path');

// setup the app
const app = express();
const PORT = process.env.PORT || 8080;

// tell the app what stuff to use
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set a static route for resources
app.use(express.static('public'));

// bring in the routes
const routes = require('./routes/router');
app.use(routes);



// tell the app to start listening for requests
app.listen(PORT, () => {
    console.log(`Beer tinder is now listening on port: ${PORT}`);
})