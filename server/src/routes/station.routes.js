const router = require('express').Router();
const ctrl = require('../controllers/station.controller');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', ctrl.findAll);
router.get('/:id', ctrl.findById);

module.exports = router;
