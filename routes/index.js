const {codes} = require('../helpers/statusCodes');
const Response = require('../helpers/Response');
const {userRouter} = require('./user');

/**
 * Router
 */
const route = (app) => {
  app.use('/api/v1/users', userRouter);

  app.get('/', (req, res) => Response.send(res, codes.success, {
    message: 'This app is running!!!',
  }));
  app.get('/api', (req, res) => Response.send(res, codes.success, {
    message: 'This app is running!!!',
  }));
  app.get('/api/v1', (req, res) => Response.send(res, codes.success, {
    message: 'This is version 1.0.0!',
  }));


  app.get('*', (req, res) => Response.send(res, codes.notFound, {
    error: 'Endpoint not found.',
  }));
};

module.exports = route;
