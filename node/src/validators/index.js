const { body } = require('express-validator');

const validateLicenseBody = [
  body('envato_username').notEmpty().withMessage('This field is required'),
  body('license')
    .notEmpty().withMessage('This field is required').bail()
    .matches(/^([a-f0-9]{8})-(([a-f0-9]{4})-){3}([a-f0-9]{12})$/i)
    .withMessage('Invalid purchase code')
];

const validateLicenseWithAdminBody = [
  ...validateLicenseBody,
  body('admin.first_name').optional().notEmpty(),
  body('admin.last_name').optional().notEmpty(),
  body('admin.email').optional().isEmail(),
  body('admin.password').optional().isLength({ min: 8 }),
  body('admin.password_confirmation').optional().custom((v, { req }) => v === req.body.admin?.password).withMessage('Passwords must match')
];

const validateDbBody = [
  body('database.DB_HOST').notEmpty().withMessage('This field is required').bail().matches(/^\S+$/).withMessage('There should be no whitespace in host name'),
  body('database.DB_PORT').notEmpty().withMessage('This field is required').bail().isInt({ min: 1, max: 65535 }).withMessage('Port must be a number').bail().matches(/^\S+$/).withMessage('There should be no whitespace in port number'),
  body('database.DB_USERNAME').notEmpty().withMessage('This field is required').bail().matches(/^\S+$/).withMessage('There should be no whitespace in username'),
  body('database.DB_DATABASE').notEmpty().withMessage('This field is required').bail().matches(/^\S+$/).withMessage('There should be no whitespace in database name')
];

function getDbValidators() {
  return [
    body('database.DB_HOST').notEmpty().withMessage('Host is required').bail().matches(/^\S+$/).withMessage('There should be no whitespace in host name'),
    body('database.DB_PORT').notEmpty().withMessage('Port is required').bail().isInt({ min: 1, max: 65535 }).withMessage('Port must be a number').bail().matches(/^\S+$/).withMessage('There should be no whitespace in port number'),
    body('database.DB_USERNAME').notEmpty().withMessage('Username is required').bail().matches(/^\S+$/).withMessage('There should be no whitespace in username'),
    body('database.DB_DATABASE').notEmpty().withMessage('Database is required').bail().matches(/^\S+$/).withMessage('There should be no whitespace in database name')
  ];
}

function getAdminValidators() {
  return [
    body('admin.first_name').notEmpty().withMessage('This field is required'),
    body('admin.last_name').notEmpty().withMessage('This field is required'),
    body('admin.email').notEmpty().withMessage('This field is required').bail().isEmail().withMessage('Must be a valid email address'),
    body('admin.password').notEmpty().withMessage('This field is required').bail().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('admin.password_confirmation').notEmpty().withMessage('This field is required').bail().custom((v, { req }) => v === req.body?.admin?.password).withMessage('Passwords must match')
  ];
}

module.exports = {
  validateLicenseBody,
  validateLicenseWithAdminBody,
  validateDbBody,
  getDbValidators,
  getAdminValidators
};

