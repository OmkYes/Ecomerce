const { getAllUsers, getAllProducts } = require("../controller/adminController")

const router = require("express").Router()


router
    .post("/products", getAllProducts)
    .get("/sellers", getAllSelle)
    .patch("/update-product/:pid", updateProduct)
    .delete("/delete-product/:pid", deleteProduct)


module.exports = router