const User = require("../models/auth.model");
const _ = require("lodash");

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../helpers/dbErrorHandling");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.MAIL_KEY);

exports.registerController = (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map(error => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          errors: "Email is taken",
        });
      }
    });

    const token = jwt.sign(
      {
        name,
        email,
        password,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "5m",
      }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Account activation link",
      html: `
                <h1>Please use the following to activate your account</h1>
                <p>${process.env.CLIENT_URL}/users/activate/${token}/</p>
                <hr />
                <p>This email may containe sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>
            `,
    };

    sgMail
      .send(emailData)
      .then(sent => {
        return res.json({
          message: `An email has been sent to ${email}. Please check your Email.`,
        });
      })
      .catch(err => {
        return res.status(400).json({
          success: false,
          errors: errorHandler(err),
        });
      });
  }
};
