const { getPublicProducts, getPublicProductDetails } = require("../controller/publicController")

const router = require("express").Router()


router
    .get("/products", getPublicProducts)
    .get("/product-details/:pid", getPublicProductDetails)




module.exports = router