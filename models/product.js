const mongoose = require("mongoose")
module.exports = mongoose.model("product", new mongoose.Schema({

    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: String, required: true },
    desc: { type: String, required: true },
    images: { type: [String], required: true },
    stock: { type: String, required: true },
    seller: { type: mongoose.Types.ObjectId, ref: "seller", required: true },
    isPublish: { type: Boolean, default: false }
}, {}))

