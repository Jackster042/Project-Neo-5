const dotenv = require("dotenv");

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  dotenv.config({ path: ".env" }); // Default to development
}
// JWT SECRET KEY & REFRESH KEY
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET_KEY;

// JWT OPTIONS PARAMETERS
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_EXPIRES_IN_REFRESH = process.env.JWT_REFRESH_TOKEN;
const JWT_ALGORITHM = process.env.JWT_ALGORITHM;

// JWT OPTIONS
const JWT_OPTIONS = {
  algorithm: JWT_ALGORITHM,
  expiresIn: JWT_EXPIRES_IN,
};

// JWT OPTIONS REFRESH
const JWT_REFRESH_OPTIONS = {
  expiresIn: JWT_EXPIRES_IN_REFRESH,
};

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

module.exports = {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_OPTIONS,
  JWT_OPTIONS,
  STRIPE_SECRET_KEY,
};
