require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./router");
const cors = require("cors");
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  methods: "POST,GET,PUT,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
const connectDB = require("./Mongo/conncetion");
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use("/api", router);
connectDB().then(
  app.listen(PORT, (res) => {
    try {
      console.log(`Server is running on port ${PORT}`);
    } catch (err) {
      console.log(err);
    }
  })
);
