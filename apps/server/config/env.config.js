// JWT SECRET KEY
const JWT_SECRET = process.env.JWT_SECRET_KEY;
// JWT OPTIONS PARAMETERS
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_ALGORITHM = process.env.JWT_ALGORITHM;
// JWT OPTIONS COMPLETE
const JWT_OPTIONS = {
  algorithm: JWT_ALGORITHM,
  expiresIn: JWT_EXPIRES_IN,
};

module.exports = {
  JWT_SECRET,
  JWT_OPTIONS,
};
