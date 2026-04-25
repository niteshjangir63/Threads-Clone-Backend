const multer = require("multer");
const { storage } = require("../config/cloudinary");

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only Images Allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter,
});

module.exports = upload;