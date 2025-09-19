const express = require('express');
const router= express.Router();
const User = require("../models/user");
const userController = require('../controllers/userController');
const user = require('../models/user');
const authMiddleware = require("../middlewares/auth")


router.get("/profile/view", authMiddleware, userController.profile)
router.patch("/profile/edit", authMiddleware, userController.editProfile)
router.patch("/profile/password", authMiddleware, userController.updatePassword)




module.exports = router;