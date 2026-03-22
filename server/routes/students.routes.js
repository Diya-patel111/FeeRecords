const express = require('express');
const { check } = require('express-validator');
const validate = require('../middleware/validate');
const studentsController = require('../controllers/students.controller');

const router = express.Router();

router.get('/', studentsController.getStudents);

router.post('/',
  [
    check('full_name')
      .isString().trim()
      .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    check('standard_id').isUUID().withMessage('Valid standard_id is required'),
    check('total_fees').isFloat({ min: 0 }).withMessage('total_fees must be 0 or greater')
  ],
  validate,
  studentsController.createStudent
);

router.put('/:id',
  [
    check('full_name').optional().isString().trim()
      .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters'),
    check('standard_id').optional().isUUID().withMessage('Valid standard_id is required'),
    check('total_fees').optional().isFloat({ min: 0 }).withMessage('total_fees must be 0 or greater')
  ],
  validate,
  studentsController.updateStudent
);

router.delete('/:id', studentsController.deleteStudent);

module.exports = router;
