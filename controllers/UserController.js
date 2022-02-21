// eslint-disable-next-line no-unused-vars
const express = require('express');
const bcrypt = require('bcrypt');
const Response = require('../helpers/Response');
const {codes} = require('../helpers/statusCodes');
const TokenUtil = require('../helpers/TokenUtil');
const {sendEmailSms} = require('../helpers/emailSender');
const {User} = require('../db/models/User');
const {Token} = require('../db/models/Token');
const { validateEmail } = require('../helpers/utils');
const moment = require('moment');

/**
 * @class UserController
 * Handle User requests
 */
class UserController {
  /**
   * This handles user registration.
   * @param {express.Request} req Express request param
   * @param {express.Response} res Express response param
   */
  async signup(req, res) {
    let { firstname, lastname, email, password } = req.body;

    try {
      let user = await User.findOne({ email: email.toLowerCase() });
      if(user){
        return Response.send(res, codes.badRequest,{
          data: {
            message:
              'The user account already exist.',
          },
        });
      }

      const pass = bcrypt.hashSync(password, 10);
      user = new User({
        firstname,
        lastname,
        email: email.toLowerCase(),
        password: pass,
      });
      await user.save();

      const token = await this.generateToken(user.email);

      console.log(token.token);

      const message = `
      <div><img style="height: 35px; display: block; margin: auto" src="${process.env.UI_URL
        }/assets/img/fidia.png"/></div>
      <p>Hello <b>${user.firstname},</b><p>
      <p style="margin-bottom: 0">Your account on ${process.env.APP_NAME
        } has been created.</p>
      <p> Validate your account with OTP ${token.token}</p>
      <br>
      <p style="margin-bottom: 0">OR ></p>
      <a href="${process.env.UI_URL}/users/validateOTP?otp=${token.token}">
      <button style="background-color:green; color:white; padding: 3px 8px; outline:0">Valiate Email</button></a>
      <p style="margin-bottom: 0">You can copy and paste to browser if above link is not clickable.</p>
      <code>${process.env.UI_URL}/users/validateOTP?otp=${token.token}</code>
      <br>
      <p> After validation</p><br>
      <p>You can login using your email and password.</p>
      <p style="margin-bottom: 0">Email: <code>${user.email}</code></p>
      <br>
      <p>${process.env.APP_NAME} &copy; ${new Date().getFullYear()}</p>`;

      await sendEmailSms({
        emailRecipients: [user.email],
        emailBody: message,
        emailSubject: `${process.env.APP_NAME} Account Created.`,
      });

      return Response.send(res, codes.created, {
        data: {
          message:
            'The user account has been created successfully and user notified.',
        },
      });
    } catch (error) {
      return Response.handleError(res, error);
    }
  }

  /**
   * This handles user login.
   * @param {express.Request} req Express request param
   * @param {express.Response} res Express response param
   */
  async login(req, res) {
    const { email, password } = req.body;
    const isValidEmail = validateEmail(email);

    console.log('log :', isValidEmail);
    try {
      let user = await User.findOne({ email: email.toLowerCase() });

      if (
        !user ||
        (!isValidEmail &&
          !(await bcrypt.compareSync(password, user.password)))
      ) {
        return Response.send(res, codes.unAuthorized, {
          error: "Invalid email address or password.",
        });
      }

      if (!user.isValidatedUser) {
        return Response.send(res, codes.unAuthorized, {
          error: "Please validate email address to login.",
        });
      }

      user = user.toObject();
      delete user.password;

      const token = TokenUtil.sign(user);
      res.cookie('authorization', token, { maxAge: 900000, httpOnly: true });
      return Response.send(res, codes.success, {
        data: { token, user },
      });
    } catch (error) {
      return Response.handleError(res, error);
    }
  }

  /**
  * This handles viewing all users.
  * @param {express.Request} req Express request param
  * @param {express.Response} res Express response param
  */
  async getUsers(req, res) {
    let { page, limit, search } = req.query;

    limit = Number.isNaN(parseInt(limit, 10)) ? 30 : parseInt(limit, 10);
    page = Number.isNaN(parseInt(page, 10)) ? 1 : parseInt(page, 10);

    const offset = (page - 1) * limit;

    try {

      let filter = {};
      if (search) {
        filter = { email: { $regex: getRegExp(search) } };
      }

      const users = await User.aggregate([
        { $match: filter },
        { $skip: offset },
        { $limit: limit },
        // { $project },
      ]);

      const data = users.map((item) => {
        
        delete item.password;
        return item;
      });

      return Response.send(res, codes.success, {
        data,
      });
    } catch (error) { return Response.handleError(res, error); }
  }

  async generateToken(userReference) {
    try {
      const newToken = Math.floor((Math.random() * 100000) + 1);;
      console.log("Generated random token:", newToken);

      const user = await User.findOne({ email: userReference.toLowerCase().trim() });
      if (!user) {
        return 'Invalid User';
      }

      let getEistingUserToken = await Token.findOne({ referenceId: user._id });

      if (getEistingUserToken) {
        getEistingUserToken.token = newToken;
        getEistingUserToken.expiry = moment().add(10, 'minute').format();
        //getEistingUserToken.isValid = true;

        await getEistingUserToken.save();
        return getEistingUserToken
      }

      const token = new Token({
        token: newToken,
        referenceId: user._id,
        expiry: moment().add(10, 'minute'),
        isValid: true
      });
      await token.save();

      return token

    } catch (error) { return error }
  }

  newGenerateToken() {
    try {
      const newToken = Math.floor((Math.random() * 100000) + 1);
      console.log("Generated random token:", newToken);
      return newToken;
    } catch (error) { return error}
  }

  async validateToken(uToken, res) {
    try {
      const eistingToken = await Token.findOne({ token: uToken});
      if (!eistingToken) {
        return Response.send(res, codes.badRequest, {
          error: 'Invalid Token',
        });
      }
      const user = await User.findOne({ _id: eistingToken.referenceId });
      if (!user) {
        return Response.send(res, codes.badRequest, {
          error: 'Invalid User',
        });
      }

      const userToken = await Token.findOne({ token: uToken, expiry: { $gte: moment().format() } })
      if (!userToken) {
        return Response.send(res, codes.badRequest, {
          error: "Expired token"
        })
      }

      user.isValidatedUser = true;

      user.save();

      return Response.send(res, codes.success, {
        data: "Successfully validated Email"
      })

    } catch (error) { return Response.handleError(res, error); }
  }

  async validateUser(req, res) {
    try {
      const { otp } = req.query;
      await this.validateToken(otp, res);
    } catch (error) { return Response.handleError(res, error); }
  }

  async regenerateToken(req, res) {
    try {
      const { email } = req.query;
      await this.generateToken(email);
    } catch (error) { return Response.handleError(res, error); }
  }
}

module.exports = new UserController();
