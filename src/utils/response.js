const successResponse = (res, status, message, data = null) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, status, message, errors = null) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
