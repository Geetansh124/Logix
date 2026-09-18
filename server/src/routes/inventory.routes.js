const router = require('express').Router();
const ctrl = require('../controllers/inventory.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/station/:stationId', authorize('inventory', 'read'), ctrl.findByStation);
router.get('/station/:stationId/depletion-projections', authorize('inventory', 'read'), ctrl.getDepletionProjections);
router.get('/station/:stationId/consumption-analytics', authorize('inventory', 'read'), ctrl.getConsumptionAnalytics);
router.get('/:id', authorize('inventory', 'read'), ctrl.findById);
router.post('/', authorize('inventory', 'create'), ctrl.create);
router.patch('/:id/stock', authorize('inventory', 'update'), ctrl.updateStock);

module.exports = router;
