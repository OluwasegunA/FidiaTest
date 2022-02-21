/**
 * @class Logger
 * Handles Logging
 */
class Logger {
  log(...args) {
    // eslint-disable-next-line no-console
    console.log(new Date().toLocaleString(), '***', ...args);
  }
}

module.exports = new Logger();
