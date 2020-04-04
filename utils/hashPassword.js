const crypto = require("crypto");

/**
 * @method
 * @description hashes passwords
 * @param {string} password
 * @returns hashed password
 * @example
 * // returns sEfaPnCDyMXeulzW/ByRk54mBMeejuqc4IAyiwFNYqU=
 * hashPassword("ABCD@123");
 */
const hashPassword = (password) => {
  const sha256 = crypto.createHash("sha256");
  const hash = sha256.update(password).digest("base64");
  return hash;
};

module.exports = hashPassword;
