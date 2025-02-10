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

// Connect to MongoDB and start server only after successful connection
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(DB_URL);
    console.log(`MongoDB connected! ${mongoose.connection.host}`);

    // Start server after successful DB connection
    const server = app.listen(PORT, () => {
      console.log(`Application running on http://localhost:${PORT}`);
    });

    // Handle server errors
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
      }
      console.error("Server error:", err);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM signal received: closing HTTP server");
      server.close(async () => {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
        console.log("HTTP server closed");
        process.exit(0);
      });
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

// Start the server
startServer();
