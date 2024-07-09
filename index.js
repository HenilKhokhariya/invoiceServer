require("dotenv").config();
const path = require("path");
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
// app.use("/Image/Logo", express.static("Image/Logo"));
app.use("/Image/Logo", express.static(path.join(__dirname, "Image/Logo")));
app.use("/Image/MobileLogo", express.static("Image/MobileLogo"));
app.use(
  "/InvoiceGeneret/userInvoice",
  express.static(path.join(__dirname, "InvoiceGeneret/userInvoice"))
);
app.use(
  "/InvoiceGeneret/userMInvoice",
  express.static("InvoiceGeneret/userMInvoice")
);
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
