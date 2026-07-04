const laptopService = require('../services/laptop.service');
const { successResponse, errorResponse } = require('../utils/response');

const getAllLaptops = async (req, res, next) => {
  try {
    const laptops = await laptopService.getAllLaptops();
    return successResponse(res, 200, 'Laptops retrieved successfully', laptops);
  } catch (error) {
    next(error);
  }
};

const getLaptopById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const laptop = await laptopService.getLaptopById(Number(id));
    if (!laptop) {
      return errorResponse(res, 404, 'Laptop not found');
    }
    return successResponse(res, 200, 'Laptop retrieved successfully', laptop);
  } catch (error) {
    next(error);
  }
};

const createLaptop = async (req, res, next) => {
  try {
    const laptop = await laptopService.createLaptop(req.body);
    return successResponse(res, 201, 'Laptop created successfully', laptop);
  } catch (error) {
    next(error);
  }
};

const updateLaptop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const laptop = await laptopService.updateLaptop(Number(id), req.body);
    return successResponse(res, 200, 'Laptop updated successfully', laptop);
  } catch (error) {
    next(error);
  }
};

const deleteLaptop = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await laptopService.deleteLaptop(Number(id));
    return successResponse(res, 200, 'Laptop deleted successfully', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllLaptops,
  getLaptopById,
  createLaptop,
  updateLaptop,
  deleteLaptop,
};
