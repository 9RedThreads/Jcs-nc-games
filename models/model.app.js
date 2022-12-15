const db = require("../db/connection");


exports.selectCategories = () => {
    return db.query("SELECT * FROM categories;").then(({rows: categories}) => {
        return categories
    })
}
exports.selectReviews = () => {
    return db.query(`SELECT
    reviews.owner, reviews.title, reviews.review_id, reviews.category, review_img_url, reviews.created_at, reviews.votes, reviews.designer,
    COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id
    ORDER BY created_at DESC;`).then(({rows: reviews}) => {
        return reviews
    })
}

exports.selectReviewById = (id) => {
    return db.query("SELECT * FROM reviews WHERE review_id = $1;", id).then(({rows: reviews}) => {
        return (reviews.length===0)? Promise.reject({ status: 404, msg: "nonexistent id" }): reviews
    })
}

exports.selectCommentsByReviewById = (id) => {
    return db.query(`
    SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`, id).then(({rows: comments}) => {
        if (comments.length===0){
            return db.query(`
            SELECT review_id FROM reviews WHERE review_id = $1;`, id).then(({rows: review})=> {
                return (review.length===0)? Promise.reject({ status: 404, msg: "nonexistent id" }): comments
            })
        }
        return comments
    })
}

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