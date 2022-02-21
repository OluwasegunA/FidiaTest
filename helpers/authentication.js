const Response = require('./Response');
const {codes} = require('./statusCodes');
const TokenUtil = require('./TokenUtil');
const Logger = require('./Logger');

/**
 * Decodes token to user
 * @param {Request | String} req
 * @param {Boolean} isReq
 */
const getUserFromToken = (req, isReq = true) => {
  let token = isReq ? req.headers.authorization || req.cookies.authorization : req;
  token = `${token || ''}`.split(' ')[1] || token;

  if (!token) {
    return {
      status: false,
      error: 'Authorization is required.',
    };
  }

  const user = TokenUtil.verify(token);
  if (!user) {
    return {
      status: false,
      error: 'Provided authorization is invalid or has expired.',
      token,
    };
  }

  return { status: true, user };
};

/**
 * This validates users who access specified URLs using accessTokens
 * @param {*} token - Access token
 * @param {*} url - URL accessed
 */
const validateKeyAccess = (token, url) => {
  const accessTokens = [
    'j38yo87hyedb67y8ypgedt6798390u87gsghsa989d7go8d',
  ];

  const accessUrls = [
    '/merchants/view/',
    '/merchants/view',
  ];

  const accessUrlsRegex = [
    /\/merchants\/view\/[\w-]+/,
    /\/terminals\/setstate[/]?/,
    /\/terminals\/count[/]?/,
    /\/terminals[/]?$/,
    /\/terminals[/]?[?[*]+]?/,
    /\/merchants[/]?$/,
    /\/merchants[/]?[?[*]+]?/,
  ];

  const checkUrlRegex = (uri) => {
    let isValid = false;
    for (const regex of accessUrlsRegex) {
      isValid = regex.test(uri);
      if (isValid) break;
    }
    return isValid;
  };

  const uri = url.split('v1')[1];
  const isValidToken = accessTokens.includes(token);
  const inUrl = accessUrls.includes(uri) || checkUrlRegex(uri);

  return isValidToken && inUrl;
};

/**
 * Checks if user is authenticated
 * @param {Request} req
 * @param {Response} res
 * @param {*} next
 */
const authenticated = (req, res, next) => {
  try {
    const theUser = getUserFromToken(req);

    if (theUser.token && validateKeyAccess(theUser.token, req.baseUrl + req.url)) {
      Logger.log('API-KEY Access by:', theUser.token);
      return next();
    }

    if (!theUser.status) {
      return Response.send(res, codes.unAuthorized, {
        error: theUser.error,
      });
    }

    const { user } = theUser;
    const tokenExpiresAt = user.exp;
    delete user.iat;
    delete user.exp;

    const tokenExpiresIn = tokenExpiresAt * 1000 - new Date().getTime();
    if (tokenExpiresIn < 20 * 60 * 1000) {
      const token = TokenUtil.sign(user);
      res.token = token;
    }

    req.user = user;
    return next();
  } catch (error) { return Response.handleError(res, error); }
};

exports.authenticated = authenticated;
exports.getUserFromToken = getUserFromToken; 
