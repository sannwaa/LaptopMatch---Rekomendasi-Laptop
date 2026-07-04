const recommendationService = require('../services/recommendation.service');
const { successResponse } = require('../utils/response');

const getRecommendations = async (req, res, next) => {
  try {
    const recommendations = await recommendationService.getRecommendations(req.body);
    return successResponse(res, 200, 'Recommendations computed successfully', recommendations);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
};
