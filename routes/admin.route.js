const { getAllProducts, getAllSellers, publishUnpublishProduct, blockUblockSeller, getAllOrders, updateOrderStatus, getAllUsers, blockUnblockUser } = require("../controller/adminController")

const router = require("express").Router()


router
    .get("/products", getAllProducts)
    .get("/sellers", getAllSellers)

    .patch("/product-update/:pid", publishUnpublishProduct)
    .patch("/seller-update/:sid", blockUblockSeller)

    .get("/fetch-all-orders", getAllOrders)
    .patch("/update-order-status/:pid", updateOrderStatus)
    .get("/users", getAllUsers)
    .patch("/update-user-account/:uid", blockUnblockUser)



module.exports = router