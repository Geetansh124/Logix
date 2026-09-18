const router = require('express').Router();
const ctrl = require('../controllers/asset.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', authorize('asset', 'read'), ctrl.findAll);
router.get('/station/:stationId', authorize('asset', 'read'), ctrl.findByStation);
router.get('/:id', authorize('asset', 'read'), ctrl.findById);
router.post('/', authorize('asset', 'create'), ctrl.create);
router.patch('/:id/status', authorize('asset', 'update'), ctrl.updateStatus);
router.post('/:id/maintenance', authorize('asset', 'update'), ctrl.scheduleMaintenance);
router.patch('/:id/maintenance/:maintenanceId', authorize('asset', 'update'), ctrl.completeMaintenance);

module.exports = router;
