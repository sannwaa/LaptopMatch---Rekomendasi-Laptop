const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return successResponse(res, 200, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
