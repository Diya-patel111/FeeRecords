const express = require('express');
const { check } = require('express-validator');
const validate = require('../middleware/validate');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login',
  [
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  authController.login
);

router.post('/logout', authController.logout);

module.exports = router;
