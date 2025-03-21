const asyncHandler = require("express-async-handler")
const Seller = require("../models/Seller")
const product = require("../models/product")
const Order = require("../models/Order")
const User = require("../models/User")
const sendEmail = require("../utils/email")

exports.getAllSellers = asyncHandler(async (req, res) => {
    const { limit, start } = req.query
    const total = await Seller.countDocuments()
    const result = await Seller.find().skip(start).limit(limit)
    res.json({ message: "fetch all sellers", result, total })
})
exports.getAllProducts = asyncHandler(async (req, res) => {
    const { limit, start } = req.query
    const total = await product.countDocuments()
    const result = await product.find().skip(start).limit(limit)
    res.json({ message: "seller account update", result, total })
})

exports.blockUblockSeller = asyncHandler(async (req, res) => {
    await Seller.findByIdAndUpdate(req.params.sid, { isActive: req.body.isActive })
    res.json({ message: "seller update success" })
})
exports.publishUnpublishProduct = asyncHandler(async (req, res) => {
    await product.findByIdAndUpdate(req.params.pid, { isPublish: req.body.isPublish })
    res.json({ message: "product update success" })
})

exports.getAllOrders = asyncHandler(async (req, res) => {
    const { limit, start } = req.query
    const total = await Order.countDocuments()
    const result = await Order.find().populate("user").populate("products.product").skip(start).limit(limit)
    res.json({ message: "Orders fetch success", result, total })
})
exports.updateOrderStatus = asyncHandler(async (req, res) => {
    const orderData = await Order.findByIdAndUpdate(req.params.pid, { status: req.body.status })
    const result = await User.findById(orderData.user)
    if (req.body.status === "deliver") {
        await sendEmail({
            to: result.email,
            subject: "order status update",
            message: `your order ${result._id} is delverd succesfully`
        })
    }
    res.json({ message: "order update success", result })
})
exports.getAllUsers = asyncHandler(async (req, res) => {
    const { start, limit } = req.query
    const total = await User.countDocuments()

    const result = await User.find().skip(start).limit(limit)
    res.json({ message: "Users fetch success", result, total })
})
exports.blockUnblockUser = asyncHandler(async (req, res) => {
    const result = await User.findByIdAndUpdate(req.params.uid, { isActive: req.body.isActive })
    res.json({ message: "Users Account Update " })
})
