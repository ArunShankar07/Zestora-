const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/foodController');
router.get('/', ctrl.listFoods);
router.get('/:id', ctrl.getFood);
router.post('/', ctrl.createFood);
router.put('/:id', ctrl.updateFood);
router.delete('/:id', ctrl.deleteFood);
module.exports = router;
