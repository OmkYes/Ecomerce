const multer = require("multer")

const sellerPhotoUpload = multer({ storage: multer.diskStorage({}) }).single("photo")
const productUpload = multer({ storage: multer.diskStorage({}) }).array("images", 5)

module.exports = { sellerPhotoUpload, productUpload }