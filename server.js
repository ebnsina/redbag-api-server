const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const connectToDb = require("./lib/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

connectToDb();

const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", postRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`);
});
