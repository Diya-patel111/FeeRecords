const express = require('express');
const { check } = require('express-validator');
const validate = require('../middleware/validate');
const paymentsController = require('../controllers/payments.controller');

const router = express.Router();

router.get('/', paymentsController.getPayments);

router.post('/',
  [
    check('student_id').isUUID().withMessage('Valid student_id is required'),
    check('amount')
      .isFloat({ min: 0.01, max: 9999999 })
      .withMessage('amount must be strictly positive and under 9,999,999'),
    check('payment_date').isISO8601().custom((value) => {
      const pDate = new Date(value);
      pDate.setHours(23, 59, 59, 999); // Allow late today
      if (pDate > new Date()) {
        throw new Error('payment_date cannot be in the future');
      }
      return true;
    }),
    check('note').optional().isString().trim()
  ],
  validate,
  paymentsController.createPayment
);

router.delete('/:id', paymentsController.deletePayment);

module.exports = router;
