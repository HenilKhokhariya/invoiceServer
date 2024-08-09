require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./router");
const routerAdmin = require("./Admin/router");
const cors = require("cors");
const path = require("path");
app.use(express.urlencoded({ extended: true }));

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  methods: "POST,GET,PUT,DELETE",
  headers: ["Content-Type", "Authorization"],
  credentials: true,
};

// app.use(express.static(path.join(__dirname, '../client/build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
// });

app.use(
  "/uploads/Image/Logo",
  express.static(path.join(__dirname, "uploads/Image/Logo"))
);

app.use(cors(corsOptions));
const connectDB = require("./Mongo/conncetion");
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use("/api", router);
app.use("/api/Admin", routerAdmin);
connectDB().then(
  app.listen(PORT, (res) => {
    try {
      console.log(`Server is running on port ${PORT}`);
    } catch (err) {
      console.log(err);
    }
  })
);
