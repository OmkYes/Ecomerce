const asynchandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

exports.sellerProtected = asynchandler(async (req, res, next) => {
    const token = req.cookies.SELLER
    if (!token) {
        return res.status(401).json({ messsage: "no cookie found" })
    }
    jwt.verify(token, process.env.JWT_KEY, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ messsage: "invalid token", error: err.message })
        }
        req.user = data._id
        next()
    })
})
exports.adminProtected = asynchandler(async (req, res, next) => {
    const token = req.cookies.ADMIN
    if (!token) {
        return res.status(401).json({ messsage: "no cookie found" })
    }
    jwt.verify(token, process.env.JWT_KEY, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ messsage: "invalid token", error: err.message })
        }
        req.user = data._id
        next()
    })
})
exports.userProtected = asynchandler(async (req, res, next) => {
    const token = req.cookies.USER
    if (!token) {
        return res.status(401).json({ messsage: "no cookie found" })
    }
    jwt.verify(token, process.env.JWT_KEY, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ messsage: "invalid token", error: err.message })
        }
        req.user = data._id
        next()
    })
})