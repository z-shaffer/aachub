const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Database connected");
})

const tradeRoutesRouter = require('./routes/tradeRoutes');

app.use('/tradeRoutes', tradeRoutesRouter);

app.listen(port, () => {
    console.log(`Server online: ${port}`)
})

module.exports = app;