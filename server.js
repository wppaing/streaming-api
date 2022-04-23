require("dotenv/config");
const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const { connectDB } = require("./config/mongoConfig");
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectDB();

app.use("/signup", require("./controllers/users/signup"));
app.use("/login", require("./controllers/users/login"));
app.use("/api", require("./routes/routes"));
app.use("/admin", require("./routes/adminRoutes"));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
