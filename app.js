const express = require('express');
const app = express();
const {catch404} = require('./controllers/controller.error');
const {getCategories} = require('./controllers/controller.app');

app.get('/api/categories', getCategories)

app.all('*',catch404);

module.exports = app