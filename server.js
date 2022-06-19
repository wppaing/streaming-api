require("dotenv/config");
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const { connectDB } = require("./config/mongoConfig");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectDB();

app.use("/signup", require("./controllers/users/signup"));
app.use("/login", require("./controllers/users/login"));
app.use("/api/v1", require("./routes/routes"));

// app.use("/search", require("./controllers/search"));

app.use("/admin", require("./routes/adminRoutes"));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
