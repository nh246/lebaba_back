const express = require('express')
const { postAReview, getUsersReview, getTotalReviewsCount } = require('./review.controller')
const varifyToken = require('../middleware/varifyToken')
const router = express.Router()

// post a review  
router.post("/post-review", varifyToken , postAReview)

// review counts
router.get("/total-reviews", getTotalReviewsCount)

// get reviews data for user 
router.get("/:userId", getUsersReview)


module.exports = router