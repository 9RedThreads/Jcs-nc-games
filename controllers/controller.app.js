const { query } = require('../db/connection')
const {selectCategories, selectReviews, selectReviewById} = require('../models/model.app')
const {} = require('../utils/utils')

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

exports.getReviewById = (req, res, next) => {
    const id = req.params
    selectReviewById(id).then((review) => {
        res.status(200).send({review})
    })
    .catch(next);
}