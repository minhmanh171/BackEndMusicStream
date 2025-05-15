const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_STRING);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ DB connection error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
