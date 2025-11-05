const express = require("express");
const { userRegistration, userLoggedIn, userLogout, getAllUsers, deleteUser, updateUserRole, editUserProfile } = require("./user.controller");
const varifyToken = require("../middleware/varifyToken");
const varifyAdmin = require("../middleware/varifyAdmin");

const router = express.Router();


// register endpoint 

router.post("/register", userRegistration);

// login routes 

router.post('/login', userLoggedIn)

// Logout routes

router.post('/logout', userLogout)

// get all users endpoints (token varify and admin)

router.get('/users', varifyToken, varifyAdmin, getAllUsers)

// delete user emdpoints (only admin)

router.delete('/users/:id', varifyToken, varifyAdmin, deleteUser)

// update user role by admin

router.put('/users/:id', varifyToken, varifyAdmin, updateUserRole)

// edit user profile 

router.patch('/edit-profile/:id' ,varifyToken , editUserProfile)

module.exports = router;
