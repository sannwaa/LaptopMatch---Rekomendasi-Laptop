const express = require('express');
const laptopController = require('../controllers/laptop.controller');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', laptopController.getAllLaptops);
router.get('/:id', laptopController.getLaptopById);
router.post('/', authMiddleware, laptopController.createLaptop);
router.put('/:id', authMiddleware, laptopController.updateLaptop);
router.delete('/:id', authMiddleware, laptopController.deleteLaptop);

module.exports = router;
