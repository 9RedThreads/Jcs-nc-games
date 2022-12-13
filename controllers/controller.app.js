const { query } = require('../db/connection')
const {selectCategories, selectReviews} = require('../models/model.app')
const {commentCount} = require('../utils/utils')

exports.getCategories = (req, res) => {
    selectCategories().then((category) => {
        res.status(200).send({category})
    })
}

exports.getReviews = (req, res, next) => {
    selectReviews().then((review) => {
        res.status(200).send({review})
    })
    .catch(next);
}