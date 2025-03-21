const asyncHandler = require("express-async-handler")
const product = require("../models/product")

exports.getPublicProducts = asyncHandler(async (req, res) => {
    const result = await product.find({ isPublish: true })
    res.json({ message: "product fetch success", result })
})
exports.getPublicProductDetails = asyncHandler(async (req, res) => {
    const result = await product.findById(req.params.pid)
    res.json({ message: "product fetch success", result })
})