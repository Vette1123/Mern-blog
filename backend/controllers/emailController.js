const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Email = require("../models/emailModel");
const sgMail = require("@sendgrid/mail");

const sendEmail = asyncHandler(async (req, res, next) => {
  const { toEmail, message, subject } = req.body;

  const user = await User.findById(req.user.id);

  const msg = {
    to: toEmail,
    from: "sadge@post.com",
    subject: subject,
    text: message,
    html: `<strong>${message}</strong>`,
  };

  const result = await sgMail.send(msg);
  console.log(result);

  const email = await Email.create({
    fromEmail: user.email,
    toEmail,
    message,
    subject,
    sentBy: user,
  });

  res.status(200).json({
    success: true,
    data: email,
  });
});

module.exports = { sendEmail };
