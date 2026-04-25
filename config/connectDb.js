const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Atlas Connected Successfully");
    } catch (e) {
        console.log("MongoDB Error:", e.message);
        process.exit(1);
    }
}

module.exports = connectDB;