const mongoose = require("mongoose")
module.exports = mongoose.model("order", new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    products: [
        {
            product: { type: mongoose.Types.ObjectId, ref: "product", required: true },
            qty: { type: String, required: true },
        }


    ],
    address: { type: String, required: true },
    city: { type: String, required: true },
    status: { type: String, enum: ["placed", "deliver", "cancle", "shiped", "out"], default: "placed" },

}, {}))