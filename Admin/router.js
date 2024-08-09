const express = require('express');
const router = express.Router();
const controler = require('./controler');
const validate = require('./Middleware-Validation/validate-middleware');
const validSchema = require('./Validator/auth-validatpr') 
router.route('/').get(controler.Home);
router.route('/Create/AdminOtp').post(validate(validSchema.adminCreateSchema),controler.AdminCreateOtp);
router.route('/Create').post(controler.AdminCreate);

module.exports = router;