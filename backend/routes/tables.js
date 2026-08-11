const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tableController');
router.get('/', ctrl.listTables);
router.post('/', ctrl.createTable);
router.put('/:id', ctrl.updateTable);
module.exports = router;
