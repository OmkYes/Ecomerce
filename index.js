const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { sellerProtected, adminProtected, userProtected } = require("./middlewares/auth.miidleware")
require("dotenv").config()
const path = require("path")


const app = express()

app.use(express.json())
app.use(express.static("dist"))
app.use(cookieParser())
app.use(cors({
    origin: "https://ecomerce-u22q.onrender.com",
    credentials: true
}))
app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/seller", sellerProtected, require("./routes/seller.route"))
app.use("/api/admin", adminProtected, require("./routes/admin.route"))
app.use("/api/public", require("./routes/public.route"))
app.use("/api/user", userProtected, require("./routes/user.route"))

app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))

})
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: "server error", error: err.message })

})

mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("mongo connected")
    app.listen(process.env.PORT, console.log("server running"))

})