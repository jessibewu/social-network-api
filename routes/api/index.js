const router = require('express').Router();
const userRoutes = require('./user-routes');

router.use('/users', pizzaRoutes);

module.exports = router;
