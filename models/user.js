const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    room: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Enables createdAt and updatedAt fields
  }
);
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

module.exports = mongoose.model("User", userSchema);
