const db = require("../db/connection");
const { includes } = require('lodash')


exports.selectCategories = () => {
  return db.query("SELECT * FROM categories;").then(({ rows: categories }) => {
    return categories;
  });
};
exports.selectReviews = (queries) => {
  let defaultQ = `SELECT
  reviews.owner, reviews.title, reviews.review_id, reviews.category, review_img_url, reviews.created_at, reviews.votes, reviews.designer,
  COUNT(comments.review_id) AS comment_count
  FROM reviews`;
  defaultQ += ` LEFT JOIN comments ON comments.review_id = reviews.review_id `;
  if (queries.category !== "*")
    defaultQ += ` WHERE reviews.category = '${queries.category}'`;
  defaultQ += ` GROUP BY reviews.review_id ORDER BY ${queries.sort_by} ${queries.order};`;
  return db.query(defaultQ).then(({ rows: reviews }) => {
    return reviews;
  });
};

exports.selectReviewById = (id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1;", id)
    .then(({ rows: reviews }) => {
      return reviews.length === 0
        ? Promise.reject({ status: 404, msg: "nonexistent id" })
        : reviews;
    });
};

exports.selectCommentsByReviewById = (id) => {
  return db
    .query(
      `
    SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
      id
    )
    .then(({ rows: comments }) => {
      if (comments.length === 0) {
        return db
          .query(
            `
            SELECT review_id FROM reviews WHERE review_id = $1;`,
            id
          )
          .then(({ rows: review }) => {
            return review.length === 0
              ? Promise.reject({ status: 404, msg: "nonexistent id" })
              : comments;
          });
      }
      return comments;
    });
};

exports.insertComment = (id, comment) => {
  const { username, body } = comment;
  return db
    .query(
      "INSERT INTO comments (review_id, author, body) VALUES ($1, $2, $3) RETURNING *;",
      [...id, username, body]
    )
    .then(({ rows: comment }) => {
      return comment;
    });
};

exports.updateVote = (id, vote) => {
  const { inc_votes } = vote;
  return db
    .query(
      "UPDATE reviews SET votes = votes+$1 WHERE review_id = $2 RETURNING *;",
      [inc_votes, ...id]
    )
    .then(({ rows: review }) => {
      return review.length === 0
        ? Promise.reject({ status: 404, msg: "nonexistent id" })
        : review;
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows: users }) => {
    return users;
  });
};

exports.deleteComment = (id) => {
  return db
    .query(
      "DELETE FROM comments WHERE comment_id = $1 RETURNING *;",
      [...id]
    )
    .then(({ rows: comment }) => {
      return comment.length === 0
      ? Promise.reject({ status: 404, msg: "nonexistent id" })
      : comment;
    });
};