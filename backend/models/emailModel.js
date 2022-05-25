const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    fromEmail: {
      type: String,
      required: [true, "From email is required"],
    },
    toEmail: {
      type: String,
      required: [true, "To email is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Email = mongoose.model("Email", emailSchema);
module.exports = Email;
