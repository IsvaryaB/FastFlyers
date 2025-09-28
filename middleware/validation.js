const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUserRegistration = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').isMobilePhone().withMessage('Valid phone number required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['customer', 'admin', 'operations']).withMessage('Invalid role'),
  handleValidationErrors
];

const validateUserLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  handleValidationErrors
];

// Shipment validation rules
const validateShipment = [
  body('consignee_city').trim().isLength({ min: 2, max: 100 }).withMessage('City must be 2-100 characters'),
  body('postal_code').isPostalCode('any').withMessage('Valid postal code required'),
  body('package_count').isInt({ min: 1 }).withMessage('Package count must be at least 1'),
  body('package_weight').isFloat({ min: 0.1 }).withMessage('Package weight must be greater than 0'),
  body('net_total').isFloat({ min: 0 }).withMessage('Net total must be non-negative'),
  body('contents_description').trim().isLength({ min: 5, max: 500 }).withMessage('Description must be 5-500 characters'),
  handleValidationErrors
];

// Tracking validation rules
const validateTrackingUpdate = [
  body('current_location').trim().isLength({ min: 2, max: 200 }).withMessage('Location must be 2-200 characters'),
  body('status_update').isIn(['In Transit', 'At Hub', 'Out for Delivery', 'Delivered']).withMessage('Invalid status'),
  handleValidationErrors
];

// Branch validation rules
const validateBranch = [
  body('branch_name').trim().isLength({ min: 2, max: 100 }).withMessage('Branch name must be 2-100 characters'),
  body('address').trim().isLength({ min: 5, max: 200 }).withMessage('Address must be 5-200 characters'),
  body('city').trim().isLength({ min: 2, max: 100 }).withMessage('City must be 2-100 characters'),
  body('state').trim().isLength({ min: 2, max: 100 }).withMessage('State must be 2-100 characters'),
  body('phone').isMobilePhone().withMessage('Valid phone number required'),
  body('working_hours').trim().isLength({ min: 5, max: 100 }).withMessage('Working hours must be 5-100 characters'),
  body('branch_type').isIn(['Main', 'Partner', 'Hub']).withMessage('Invalid branch type'),
  handleValidationErrors
];

// Support ticket validation rules
const validateSupportTicket = [
  body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be 5-200 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateShipment,
  validateTrackingUpdate,
  validateBranch,
  validateSupportTicket,
  handleValidationErrors
};