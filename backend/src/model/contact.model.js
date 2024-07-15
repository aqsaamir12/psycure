const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
     
    },
 
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactUs", UserSchema);