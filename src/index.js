/* eslint-disable no-undef */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
const app = express();
app.set('view engine', 'ejs');
const { API_PORT } = process.env;
const { MONGO_URI } = process.env;
const port = process.env.PORT || API_PORT;

connect(MONGO_URI)
    .then(() => {})
    .catch(error => console.log('Could not conect to mongo db ' + error));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
    cors({
        origin: '*',
        methods: 'GET, PUT, PATCH, POST, DELETE, OPTIONS, HEAD',
    }),
);
app.use(require('./router'));

app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});
