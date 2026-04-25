const User = require("../models/User");
const { asyncWrap } = require("../utils/asyncWrap");
const { cloudinary } = require("../config/cloudinary");
module.exports.Profile = async (req, res) => {

    const user = await User.findById(req.userId);

    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    user.password = ""

    res.json({ user, isUser: true });
};
module.exports.publicProfile = async (req, res) => {

    const { username } = req.params;
    const user = await User.findOne({ username: username });

    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    user.password = ""

    res.json({ user });
};

module.exports.editProfile = asyncWrap(async (req, res) => {

    const profile = await User.findById(req.userId);

    if (!profile) return res.status(404).json({ message: "user not found", success: false });
    const { username, name, bio } = req.body;


    profile.username = username,
        profile.name = name,
        profile.bio = bio

    await profile.save();

    res.json({ message: "Profile Updated!", success: true });



})



module.exports.updateProfileImage = asyncWrap(async (req, res) => {
  const user = await User.findById(req.userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  console.log("Old public id:", user.profilePublicId);

  if (user.profilePublicId) {
    const result = await cloudinary.uploader.destroy(user.profilePublicId);
    console.log("Cloudinary delete result:", result);
  }

  if (req.file) {
    user.profile = req.file.path;
    user.profilePublicId = req.file.filename;
  }

  await user.save();

  res.json({
    message: "Profile Updated!",
    user,
  });
});