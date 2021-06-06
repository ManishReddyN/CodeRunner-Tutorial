require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

const mongoSRV = process.env.MONGO_SRV;
const port = process.env.PORT || 8000;

mongoose.connect(mongoSRV, {
    "useNewUrlParser": true,
    "useUnifiedTopology": true,
    "useCreateIndex": true
}).then(() => console.log("DB Connected")).catch((err) => console.log("Error connecting DB", err))

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
console.log("Hello");
app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`App is running on PORT: ${port}`);
})
