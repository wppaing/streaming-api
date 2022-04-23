require("colors");
const { MongoClient } = require("mongodb");
const asyncHandler = require("express-async-handler");

const client = new MongoClient(process.env.MONGO_URI);

const connectDB = asyncHandler(async () => {
  try {
    await client.connect();
    console.log(`Connected to database...`.cyan.underline);
  } catch (error) {
    console.log(error);
  }
});

module.exports = { connectDB, client };
