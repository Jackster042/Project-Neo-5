const dotenv = require("dotenv");
// dotenv.config();

const mongoose = require("mongoose");
const app = require("./index.js");

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env" }); // Default to development
}

// ENV
const DB_URL = process.env.MONGO_DB_URL;
const PORT = process.env.PORT;

// MONGO_DB
mongoose
  .connect(DB_URL)
  .then((res) => console.log(`MongoDB connected! ${mongoose.connection.host}`))
  .catch((err) => console.error("Failed to connect to MongoDB"));

//   SERVER
app.listen(PORT, (err) => {
  if (err) return console.error("Failed to start application");
  else return console.log(`Application running on http://localhost:${PORT}`);
});
