const { addProducts, getProduct, updateProduct, deleteProduct } = require("../controller/seller.controller")

const router = require("express").Router()


router
    .post("/add-product", addProducts)
    .get("/get-product", getProduct)
    .patch("/update-product/:pid", updateProduct)
    .delete("/delete-product/:pid", deleteProduct)


module.exports = router