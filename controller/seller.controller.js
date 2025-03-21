const asynchandler = require("express-async-handler")
const { productUpload } = require("../utils/upload")
const cloud = require("./../utils/cloudinary")
const product = require("../models/product")
const path = require("path")


exports.addProducts = asynchandler(async (req, res) => {
    productUpload(req, res, async err => {
        if (err) {
            console.log(err);

            return res.status(400).json({ message: "multer error", error: err.message })

        }
        const img = []
        for (const item of req.files) {
            const { secure_url } = await cloud.uploader.upload(item.path)
            img.push(secure_url)
        }
        await product.create({ ...req.body, images: img, seller: req.user })
        res.json({ message: "product add success" })
    })

})
exports.getProduct = asynchandler(async (req, res) => {
    const result = await product.find({ seller: req.user })
    res.json({ message: "product fetch success", result })
})
exports.updateProduct = asynchandler(async (req, res) => {
    res.json({ message: "product update success" })
})
exports.deleteProduct = asynchandler(async (req, res) => {
    const { pid } = req.params
    const result = await product.findById(pid)
    for (const item of result.images) {
        await cloud.uploader.destroy(path.basename(item).split(".")[0])
    }
    await product.findByIdAndDelete(pid)
    res.json({ message: "product delete success" })
})