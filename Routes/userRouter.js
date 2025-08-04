const express = require ("express")

const userController = require ("../controller/userController")

const router = express.Router()

router.post("/register/user", userController.registerUser)
router.post("/login/user",userController.loginUser)
router.post("/forgot-password", userController.forgotPasswordUser)
router.post("/reset-password", userController.resetPasswordUser)

module.exports = router