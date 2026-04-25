const { asyncWrap } = require("../utils/asyncWrap");
const User = require("../models/User");

module.exports.searchUser = asyncWrap(async (req, res) => {

    const query = req.query.q;

    try {

        if (!query) {
            return res.status(400).json({ message: "no search query" });
        }

        const users = await User.find({
            $or: [

                { username: { $regex: query, $options: "i" } },
                { name: { $regex: query, $options: "i" } }

            ]

        })

       

        res.json(users)

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }




})