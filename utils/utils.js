const db = require("../db/connection");
const { includes } = require('lodash')


exports.checkId = (id) => {
  const ids = Object.values(id);
  return ids;
};

exports.getQueries = (queries) => {
  const queryDefaults = { category: "*", sort_by: "created_at", order: "DESC" };
  const userQueries = {};
  const validCategorys = ['social deduction', 'euro game', 'dexterity'];
  const validSort_by = ['title', 'designer', 'owner', 'review_img_url', 'review_body', 'category', 'created_at', 'votes'];
  (queries.category!== undefined & validCategorys.includes(queries.category))? userQueries.category = queries.category : userQueries.categoryErr = 'Invalid category returning default';
  (queries.sort_by!== undefined & validSort_by.includes(queries.sort_by))? userQueries.sort_by = queries.sort_by : userQueries.sortErr = 'Invalid sort returning default';
  (queries.order!== undefined & ['ASC', 'DESC'].includes(queries.order))? userQueries.order = queries.order : userQueries.orderErr = 'Invalid order returning default'; 
  return { ...queryDefaults, ...userQueries };
};
