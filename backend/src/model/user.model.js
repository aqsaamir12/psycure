const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const { pwdSaltRounds } = require("../config/vars");

const userSchema = new mongoose.Schema(
    {
        fname: {
          type: String,
          required: true,
          trim: true,
          max: 20,
        },
        lname: {
          type: String,
          required: true,
          trim: true,
          max: 20,
        },
        email: {
          type: String,
          required: true,
          trim: true,
        },
        password: {
          type: String,
          required: true,
          trim: true,
        },
        age: {
          type: Number,
          required: true,
          trim: true,
          max: 100,
        },
        profileImage: { type: String, default: "" },
        personality: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Personality', 
            default: null 
        },
      },
      { timestamps: true }
  );
/**
 * This method is used to verify if a provided password matches the hashed password
 * stored in the user's database record.
 *
 * @param {string} password - The password to be checked.
 * @returns {boolean} - Returns true if the provided password matches the hashed password; otherwise, returns false.
 *
 */
userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * This method generates a password hash using bcrypt for the provided password.
 *
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} - A promise that resolves with the generated password hash.
 *
 */
userSchema.methods.getPasswordHash = async function (password) {
  const rounds = pwdSaltRounds ? parseInt(pwdSaltRounds) : 10;
  const hash = await bcrypt.hash(password, rounds);
  return hash;
};

/**
 * Pre-Save Middleware for User Schema
 *
 * This middleware is executed before saving a user document to the database. It handles password hashing
 * if the "password" field has been modified.
 *
 * @param {function} next - The callback function to continue with the save operation.
 * @returns {function} - Calls the next function in the middleware chain.
 */
userSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();
    const rounds = pwdSaltRounds ? parseInt(pwdSaltRounds) : 10;
    const hash = await bcrypt.hash(this.password, rounds);
    this.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});
module.exports = mongoose.model('User', userSchema);
