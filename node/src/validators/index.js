import { body } from 'express-validator';

export const validateLicenseBody = [
  body('envato_username').notEmpty().withMessage('Envato Username is required'),
  body('license')
    .notEmpty().withMessage('License is required')
    .matches(/^([a-f0-9]{8})-(([a-f0-9]{4})-){3}([a-f0-9]{12})$/i)
    .withMessage('Invalid purchase code')
];

export const validateLicenseWithAdminBody = [
  ...validateLicenseBody,
  body('admin.first_name').optional().notEmpty(),
  body('admin.last_name').optional().notEmpty(),
  body('admin.email').optional().isEmail(),
  body('admin.password').optional().isLength({ min: 8 }),
  body('admin.password_confirmation').optional().custom((v, { req }) => v === req.body.admin?.password).withMessage('Passwords must match')
];

export const validateDbBody = [
  body('database.DB_HOST').notEmpty().withMessage('Host is required').matches(/^\S+$/),
  body('database.DB_PORT').notEmpty().withMessage('Port is required').matches(/^\S+$/),
  body('database.DB_USERNAME').notEmpty().withMessage('Username is required').matches(/^\S+$/),
  body('database.DB_DATABASE').notEmpty().withMessage('Database is required').matches(/^\S+$/)
];

