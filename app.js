const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/signup', require('./controllers/users/signup'));
app.use('/login', require('./controllers/users/login'));
app.use('/api/v1', require('./routes/routes'));
// app.use("/search", require("./controllers/search"));

app.use('/admin', require('./routes/adminRoutes'));

app.use(errorHandler);

module.exports = app;
