const express = require('express');
const app = express();
const cors = require('cors');
const ConnectTODB = require('./config/db');
const UserRoute = require('./routes/user.route');
const AiRoute = require('./routes/ai.route');

ConnectTODB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/users', UserRoute);
app.use('/ai', AiRoute);

module.exports = app;