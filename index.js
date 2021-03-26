const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv")

dotenv.config()


// connect to db
mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("mongodb is connected"))
    .catch((err) => console.log("Error: ", err))

// middlewares
app.use(express.json())

// routes
app.use('/user', require('./routes/user'))
app.listen(5000, () => console.log("Server is running....."))