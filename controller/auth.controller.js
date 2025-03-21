const asynchandler = require("express-async-handler")
const { sellerPhotoUpload } = require("../utils/upload")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const Seller = require("../models/Seller")

const cloud = require("./../utils/cloudinary")
const Admin = require("../models/Admin")
const sendEmail = require("../utils/email")

const { differenceInSeconds } = require("date-fns")
const { OAuth2Client } = require("google-auth-library")
const User = require("../models/User")

// Userr start
exports.contnueWithGoogle = asynchandler(async (req, res) => {
    const { credential } = req.body
    const client = new OAuth2Client({ clientId: process.env.GOOGLE_CLIENT_ID })
    const googleData = await client.verifyIdToken({ idToken: credential })
    const { email, name, picture } = googleData.payload

    const result = await User.findOne({ email })
    if (result) {
        const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY)
        res.cookie("USER", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
        res.json({
            message: "user Login success", result: {
                name: result.name,
                email: result.email,
                picture: result.picture
            }
        })
    } else {
        const userData = await User.create({ name, email, picture })
        const token = jwt.sign({ _id: userData._id }, process.env.JWT_KEY)
        res.cookie("USER", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
        res.json({
            message: "user Register success", result: {
                name: userData.name,
                email: userData.email,
                picture: userData.picture
            }
        })

    }
})

exports.userLogout = asynchandler(async (req, res) => {
    res.clearCookie("USER")
    res.json({ message: "user logout success" })
})
// Userr end

// Seller  Start
exports.sellerRegister = asynchandler(async (req, res) => {
    sellerPhotoUpload(req, res, async (err) => {
        if (err) {
            res.status(400).json({
                message: "unable to upload",
                error: err.message
            })
        }
        const result = await Seller.findOne({
            $or: [
                { email: req.body.email },
                { mobile: req.body.mobile }
            ]
        })
        if (result) {
            return res.status(401).json({ message: "email / mobile already exist" })
        }
        const { secure_url } = await cloud.uploader.upload(req.file.path)
        const hash = await bcrypt.hash(req.body.password, 10)
        await Seller.create({ ...req.body, password: hash, photo: secure_url })

        res.json({ message: "seller regiseter success" })
    })
})

exports.sellerLogin = asynchandler(async (req, res) => {
    const { username } = req.body
    const result = await Seller.findOne({
        $or: [
            { email: username },
            { mobile: username }
        ]
    })

    if (!result) {
        return res.status(401).json({ message: "email / mobile does not exist" })
    }
    const verify = await bcrypt.compare(req.body.password, result.password)
    if (!verify) {
        return res.status(401).json({ message: "invalid password" })
    }
    const token = jwt.sign({ _id: result._id, name: result.name }, process.env.JWT_KEY)
    res.cookie("SELLER", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false
    })
    res.json({
        message: "seller login success", result: {
            name: result.name,
            photo: result.photo,
            isActive: result.isActive
        }
    })
})

exports.sellerLogout = asynchandler(async (req, res) => {
    res.clearCookie("SELLER")
    res.json({ message: "seller logout success" })
})
// Seller End


// Admin  Start
exports.adminRegister = asynchandler(async (req, res) => {
    await Admin.create(req.body)
    res.json({ message: "admin regiseter success" })
})

exports.sendOtp = asynchandler(async (req, res) => {
    const { username } = req.body
    const result = await Admin.findOne({
        $or: [
            { email: username },
            { mobile: username }
        ]
    })
    if (!result) {
        return res.status(401).json({ message: "invalid email / mobile" })

    }
    const otp = Math.floor(100000 + Math.random() * 900000)
    await sendEmail({
        to: result.email,
        subject: "login otp",
        message: `your login otp is ${otp}`
    })

    await Admin.findByIdAndUpdate(result._id, { otp, otpSendOn: new Date() })
    res.json({ message: "admin otp send success" })
})

exports.adminLogin = asynchandler(async (req, res) => {
    const { username, otp } = req.body
    const result = await Admin.findOne({
        $or: [
            { email: username },
            { mobile: username }
        ]
    })
    if (!result) {
        return res.status(401).json({ message: "invalid email / mobile" })

    }

    if (result.otp != otp) {
        return res.status(401).json({ message: "invalid otp" })

    }
    if (differenceInSeconds(new Date(), result.otpSendOn) > 60) {
        return res.status(401).json({ message: "otp expired" })

    }

    await Admin.findByIdAndUpdate(result._id, { otp: null })
    const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY)
    res.cookie("ADMIN", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
    res.json({
        message: "admin login success",
        result: {
            name: result.name,
            email: result.email,
            mobile: result.mobile
        }
    })

})

exports.adminLogout = asynchandler(async (req, res) => {
    res.clearCookie("ADMIN")
    res.json({ message: "admin logout success" })
})
// Admin End