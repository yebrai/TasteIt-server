// middleware that will send the file to cloudinary
// cloudinary config

const cloudinary = require("cloudinary").v2
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")

// pasar las credenciales de cloudinary

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

// crea las configuraciones del bundle
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        allowedFormats: ["jpg", "png"],
        folder: "profileImage"
    }
})

const uploader = multer({
    storage
})


module.exports = uploader