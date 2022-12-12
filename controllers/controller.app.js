const { query } = require('../db/connection')
const categories = require('../db/data/test-data/categories')
const {selectCategories} = require('../models/model.app')

exports.getCategories = (req, res) => {
    selectCategories().then((category) => {
        console.log(category)
        res.status(200).send({category})
    })
}