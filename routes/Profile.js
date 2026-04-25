const express = require("express");
const router = express.Router();
const { Profile, publicProfile, editProfile, updateProfileImage } = require("../controllers/Profile");
const { verifyToken } = require("../middlewares/authMiddleware")
const uploadProfile = require("../middlewares/multerProfile")
router.get("/", verifyToken, Profile)
router.get("/:username", publicProfile)
router.put("/update", verifyToken, editProfile);
router.patch(
    "/update/avatar",
    verifyToken,
    uploadProfile.single("image"),
    updateProfileImage
);

module.exports = router; 