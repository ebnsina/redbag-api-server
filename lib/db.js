const mongoose = require("mongoose");

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Database connected!`);
  } catch (error) {
    console.log(error);
    console.log(`Failed to connect database!`);
  }
};

module.exports = connectToDb;
