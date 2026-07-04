const { verifyToken } = require('../utils/jwt');
const { errorResponse } = require('../utils/response');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Unauthorized: Access token is missing or invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.admin = decoded;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Unauthorized: Invalid or expired token');
  }
};

module.exports = authMiddleware;
