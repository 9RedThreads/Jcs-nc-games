const { query } = require('../db/connection')
const {
    selectCategories,
    selectReviews,
    selectReviewById,
    selectCommentsByReviewById,
    insertComment,
    updateVote,
    selectUsers
 } = require('../models/model.app')
const {checkId, getQueries} = require('../utils/utils')

exports.getCategories = (req, res) => {
    selectCategories().then((category) => {
        res.status(200).send({category})
    })
}

exports.getReviews = (req, res, next) => {
    const queries = getQueries(req.query)
    selectReviews(queries).then((review) => {
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

exports.getCommentsByReviewId = (req, res, next) => {
    const review_id = checkId(req.params)
    selectCommentsByReviewById(review_id).then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next);
}

exports.postComment = (req, res, next) => {
    const id = checkId(req.params)
    const newComment = req.body;
    insertComment(id, newComment)
      .then((comment) => {
        res.status(201).send({ comment });
      })
      .catch(next);
  };

  exports.patchVotes = (req, res, next) => {
    const id = checkId(req.params)
    const newVote = req.body;
    updateVote(id, newVote)
      .then((review) => {
        res.status(200).send({review});
      })
      .catch(next);
  };

  exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch(next);
}
