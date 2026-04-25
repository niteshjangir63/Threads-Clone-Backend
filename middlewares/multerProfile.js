const multer = require("multer");
const { profileStorage } = require("../config/cloudinary");



const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {  
        cb(null, true);
    } else {
        cb(new Error("Only Images Allowed"), false);
    }
};

const uploadProfile = multer({ storage:profileStorage, fileFilter });

module.exports = uploadProfile;