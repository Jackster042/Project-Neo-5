const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 MINUTES TIMER
  max: 5, // LIMIT IP TO 5 ATTEMPTS PER WINDOW_MS
  message: "Too many requests, try again later",
});

module.exports = authLimiter;
