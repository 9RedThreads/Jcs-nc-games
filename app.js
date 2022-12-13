const express = require('express');
const app = express();
const {catch404} = require('./controllers/controller.error');
const {getCategories, getReviews} = require('./controllers/controller.app');

app.get('/api/categories', getCategories)
app.get('/api/reviews', getReviews)


app.use((err, req, res, next) => {
    console.log(err)
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  });

app.all('*',catch404);

module.exports = app