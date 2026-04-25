const { asyncWrap } = require("../utils/asyncWrap")
const User = require("../models/User");

module.exports.apiMe = asyncWrap(async (req,res) => {

    if(!req.userId){
        return res.status(401).json({message:"Unauthorized"})
    }

    const user = await User.findById(req.userId);
    user.password = "";

    res.status(200).json({
        success:true,
        user:user
    })

})