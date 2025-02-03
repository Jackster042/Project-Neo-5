require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./index.js");

// ENV
const DB_URL = process.env.MONGO_DB_URL;
const PORT = process.env.PORT;

// MONGO_DB
mongoose
  .connect(DB_URL)
  .then((res) => console.log("MongoDB connected!"))
  .catch((err) => console.error("Failed to connect to MongoDB"));

//   SERVER
app.listen(PORT, (err) => {
  if (err) return console.error("Failed to start application");
  else return console.log(`Application running on http://localhost:${PORT}`);
});
