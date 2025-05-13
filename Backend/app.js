const express = require('express');
const app = express();
const cors = require('cors');
const AiRoute = require('./routes/ai.route');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/ai', AiRoute);

module.exports = app;