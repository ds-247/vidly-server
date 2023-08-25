const genres = require('./Routes/genres');
const customers = require('./Routes/customers');
const express = require("express");
const app = express();
const mongoose = require("mongoose");

connectDB().then(()=> console.log("Connected to DB Successfully....")).catch((err) => console.log(err));

async function connectDB() {
  await mongoose.connect("mongodb://127.0.0.1:27017/VIDLY");
}

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server started at port ${PORT}`));
