const router = require('express').Router();
const ctrl = require('../controllers/emergency.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.post('/station/:stationId', authorize('emergency', 'create'), ctrl.trigger);
router.get('/station/:stationId', authorize('emergency', 'read'), ctrl.findByStation);
router.get('/station/:stationId/resource-dashboard', authorize('emergency', 'read'), ctrl.getResourceDashboard);
router.get('/:id', authorize('emergency', 'read'), ctrl.findById);
router.patch('/:id/status', authorize('emergency', 'update'), ctrl.updateStatus);

module.exports = router;
