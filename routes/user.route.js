const { placeOrder, getOrder } = require("../controller/user.controller")

const router = require("express").Router()


router
    .post("/place-order", placeOrder)
    .get("/fetch-order", getOrder)


module.exports = router