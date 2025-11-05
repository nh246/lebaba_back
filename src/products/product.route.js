const express = require('express')

const  verifyToken  = require('../middleware/varifyToken')
const verifyAdmin = require('../middleware/varifyAdmin')

const { createNewProduct, getAllProducts, getSingleProduct, updateProductById, deleteProductById } = require('./product.controller')
const router = express.Router()

// Create a product ( only admin)
router.post("/create-product", createNewProduct)

// get all products
router.get("/", getAllProducts)

// get single products
router.get("/:id", getSingleProduct)

// update product ( admin only)
router.patch("/update-product/:id",verifyToken, verifyAdmin,  updateProductById)

// delete product (admin only)
router.delete("/:id",verifyToken, verifyAdmin, deleteProductById)


module.exports = router