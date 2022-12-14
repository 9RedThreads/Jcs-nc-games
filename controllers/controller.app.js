const { query } = require('../db/connection')
const {selectCategories, selectReviews, selectReviewById} = require('../models/model.app')
const {checkId} = require('../utils/utils')

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
    const review_id = checkId(req.params)
    selectReviewById(review_id).then((review) => {
        res.status(200).send({review: review[0]})
    })
    .catch(next);
}