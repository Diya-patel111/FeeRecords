const express = require('express');
const { check } = require('express-validator');
const validate = require('../middleware/validate');
const standardsController = require('../controllers/standards.controller');

const router = express.Router();

router.get('/', standardsController.getStandards);

router.post('/',
  [
    check('name').isString().trim().notEmpty().withMessage('Name is required'),
    check('display_order').optional().isInt().withMessage('display_order must be an integer')
  ],
  validate,
  standardsController.createStandard
);

router.delete('/:id', standardsController.deleteStandard);

module.exports = router;
