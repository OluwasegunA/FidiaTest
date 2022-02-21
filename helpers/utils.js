const Response = require('./Response');
const {codes} = require('./statusCodes');

/**
 * Returns current date string
 * @param {String} sep
 */
const curDate = (sep = '-') => {
  const today = new Date();
  return today.getFullYear()
    + sep + `${(today.getMonth() + 1)}`.padStart(2, 0)
    + sep + `${today.getDate()}`.padStart(2, 0);
};

/**
 * Validates a date
 * @param {String} date - Date String
 * @param {Object} res - Express Ressponse
 */
const validateDate = (date = '', res) => {
  const parts = date.split(' ')[0].split('-');
  if (parts[0].length !== 4 || parts[1].length !== 2 || parts[2].length !== 2) {
    Response.send(res, codes.badRequest, {
      error: "Date format must be 'yyyy-mm-dd'.",
    });
    return false;
  }
  return true;
};

/**
 * Excapes regex
 * @param {String} text
 */
const escapeRegExp = text => `${text}`.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

/**
 * Creates regex
 * @param {String} text
 */
const getRegExp = text => new RegExp(escapeRegExp(text), 'i');

/**
 * Validate an email
 * @param {String} str
 */
// const validateEmail = str => /^[\w._]+@[\w]+[-.]?[\w]+\.[\w]+$/.test(str);
const validateEmail = str => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(str);
const checkNumber = input => `${input}`.search(/\D/) < 0;

const validateMongoID = str => `${str}`.match(/^[0-9a-fA-F]{24}$/);

const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (const i in a) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

const arraysNoCaseEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (const i in a) {
    const c = typeof a[i] === 'string' ? a[i].toLowerCase() : a[i];
    const d = typeof b[i] === 'string' ? b[i].toLowerCase() : b[i];
    if (c !== d) return false;
  }
  return true;
};

exports.validateDate = validateDate;
exports.curDate = curDate;
exports.arraysEqual = arraysEqual;
exports.getRegExp = getRegExp;
exports.validateEmail = validateEmail;
exports.validateMongoID = validateMongoID;
exports.arraysNoCaseEqual = arraysNoCaseEqual;
