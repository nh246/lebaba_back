const express = require('express')
const { errorResponse, successResponse } = require('../utilis/responseHandler')
const User = require('../users/user.model')
const Order = require('../orders/order.model')
const Reviews = require('../reviews/review.model')
const Products = require('../products/product.model')
const e = require('express')
const router = express.Router()

// user stats
router.get("/user-stats/:email" , async(req , res) => {
    const {email} = req.params

    if(!email){
        return errorResponse(res, 400, "Email is required")
    }

    try {
        const user= await User.findOne({email: email})
        if(!user){
            return errorResponse(res, 404, "User not found")
        }

        // total Payments
        const totalPaymentsResults = await Order.aggregate([
            {$match: {email: email}},
            {$group: {_id: null, totalAmount: {$sum: "$amount"}}}
        ])
        const totalPaymentsAmount = totalPaymentsResults.length > 0 ? totalPaymentsResults[0].totalAmount : 0

        // total reviews
        const totalReviews = await Reviews.countDocuments({userId: user._id})
        const purchasedProductsIds = await Order.distinct("products.productId" , {email: email})
        const totalPurchasedProducts = purchasedProductsIds.length

        return successResponse(res, 200 , "Feched User Stats successfully",
            {
                totalPayments: Number(totalPaymentsAmount.toFixed(2)) ,
                totalReviews,
                totalPurchasedProducts
            }
        )


    } catch (error) {
        return errorResponse(res, 500, "Failed to get user stats", error)
    }
})

// admin stats 
router.get("/admin-stats" , async(req, res) => {

    try {
        
        // Count total orders
        const totalOrders = await Order.countDocuments()

        // count total products
        const totalProducts = await Products.countDocuments()

        // count reviews 
        const totalReviews= await Reviews.countDocuments()

        // count total users
        const totalUsers = await User.countDocuments()

        // count total earnings
        const totalEarningsResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ])

        const totalEarnings = totalEarningsResult.length > 0 ? totalEarningsResult[0].totalAmount.toFixed(2) : 0

        // calculate the monthly earnings by summing the 'amounr' of all orders grouped by match
        const monthlyEarningsResult = await Order.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    monthlyEarnings: { $sum: "$amount" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // short by year and month
            }
        ])

        // format the monthly earnings data for easier consumption on the frontend 

        const monthlyEarnings = monthlyEarningsResult.map(entry => ({
            month: entry._id.month,
            year: entry._id.year,
            earnings: entry.monthlyEarnings
        }) )

        // send the aggregated data to the frontend
        res.status(200).json({
            totalOrders,
            totalProducts,
            totalReviews,
            totalUsers,
            totalEarnings,
            monthlyEarnings
        })



    } catch (error) {
        console.error("Error fetching getting admin stats",error)
        res.status(500).json({message: "Failed to get admin stats"})
    }
})


module.exports = router