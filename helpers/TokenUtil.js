const jsonwebtoken = require('jsonwebtoken');
const cryptojs = require('crypto-js');
const Logger = require('./Logger');
require("dotenv").config();

/**
 * @class TokenUtil
 * Handle JWT Token Management
 */
class TokenUtil {
  /**
   * Sign payload and returns JWT
   * @param {Object} payload
   * @param {String} time - Expiry time
   */
  static sign(payload, time = '10d') {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, { expiresIn: time });
  }

  /**
   * Verifies JWT and returns Payload
   * @param {String} token - JWT
   */
  static verify(token) {
    try {
      return jsonwebtoken.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  static AESEncrypt(str) {
    let byteArray = '';
    try {
      byteArray = cryptojs.AES.encrypt(str || '', process.env.SECRET_KEY);
    } catch (error) { Logger.log(error); }
    return byteArray.toString();
  }

  static AESDecrypt(str) {
    let byteArray = '';
    try {
      byteArray = cryptojs.AES.decrypt(str || '', process.env.SECRET_KEY);
      byteArray = byteArray.toString(cryptojs.enc.Utf8);
    } catch (error) { Logger.log(error); }
    return byteArray;
  }
}

module.exports = TokenUtil;
