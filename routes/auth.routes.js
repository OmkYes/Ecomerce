const { contnueWithGoogle, userLogout, sellerLogin, sellerLogout, adminLogin, sellerRegister, sendOtp, adminRegister, adminLogout } = require("../controller/auth.controller")

const router = require("express").Router()


router
    .post("/continue-with-google", contnueWithGoogle)
    .post("/user-logout", userLogout)

    .post("/seller-register", sellerRegister)
    .post("/seller-login", sellerLogin)
    .post("/seller-logout", sellerLogout)

    .post("/admin-register", adminRegister)
    .post("/send-otp", sendOtp)
    .post("/admin-login", adminLogin)
    .post("/admin-logout", adminLogout)

module.exports = router