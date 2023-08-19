const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");
const app = express();
const mongoose = require("mongoose");
const hotelRoutes = require("./routes/hotelRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const path = require("path");

app.use(cors());
app.use(express.json());
app.use("/api", hotelRoutes);
app.use("/api", userRoutes);
app.use("/api", adminRoutes);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.k2ngtvf.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`
  )
  .then((result) => {
    console.log("server start!");
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));
