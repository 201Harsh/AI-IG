const express = require('express');
const app = express();
const cors = require('cors');
const ConnectTODB = require('./config/db');
const UserRoute = require('./routes/user.route');

ConnectTODB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/users', UserRoute);

module.exports = app;