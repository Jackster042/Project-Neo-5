const { execSync } = require("child_process");
const mongoose = require("mongoose");

const cleanup = async () => {
  try {
    // Kill process on port 5000
    execSync("kill-port 5000");
    console.log("Port 5000 cleared");

    // Close any existing MongoDB connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed");
    }
  } catch (error) {
    console.log("Cleanup completed - no active processes found");
  }
};

cleanup();
