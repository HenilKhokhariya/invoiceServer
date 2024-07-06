const mongoose = require("mongoose");
const URL = process.env.MONGOURL;
const connect = async (req, res) => {
  try {
    await mongoose.connect(URL);
    console.log("Connect DataBase");
  } catch (error) {
    console.log("Not Connect DataBase");
  }
};

module.exports = connect;
