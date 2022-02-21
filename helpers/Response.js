const {codes} = require('./statusCodes');
const Logger = require('./Logger');

/**
 * @class Response
 * Handle sending HTTP Responses
 */
class Response {
  /**
   * Sends HTTP response
   * @param {Object} res - Express Response
   * @param {Number} status - HTTP Status code
   * @param {Object} data
   */
  send(res, status, data) {
    const { token } = res;
    res.status(status).send({
      status,
      ...data,
      token,
    });
  }

  /**
   * Sends HTTP response for internal errors
   * @param {Object} res - Express Response
   * @param {*} error
   */
  handleError(res, error = {}) {
    Logger.log(error);
    return this.send(res, codes.serverError, {
      error: 'Internal server error',
    });
  }

  validationError(res, fields = {}, isConflict = false) {
    return this.send(res, isConflict ? codes.conflict : codes.badRequest, {
      error: 'Validation errors.',
      fields,
    });
  }

  validationErrorISW(res, fields = {}, isConflict = false) {
    const message = fields.description;
    return this.send(res, isConflict ? codes.conflict : codes.badRequest, {
      error: 'Validation errors.',
      message,
    });
  }

  abort(res, error = 'Resource not found.', code = codes.notFound) {
    return this.send(res, code, { error });
  }
}

module.exports = new Response();
