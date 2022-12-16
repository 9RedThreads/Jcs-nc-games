const express = require("express");
const app = express();
const { catch404 } = require("./controllers/controller.error");
const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postComment,
  patchVotes,
  getUsers
} = require("./controllers/controller.app");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.get("/api/users", getUsers)

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", patchVotes)

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "invalid request" });
  } else {
    next(err);
  }
});

app.all("*", catch404);

module.exports = app;
