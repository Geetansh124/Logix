const router = require('express').Router();
const ctrl = require('../controllers/personnel.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', authorize('personnel', 'read'), ctrl.findAll);
router.get('/expedition/:expeditionId', authorize('personnel', 'read'), ctrl.findByExpedition);
router.get('/:id', authorize('personnel', 'read'), ctrl.findById);
router.post('/', authorize('personnel', 'create'), ctrl.create);
router.patch('/:id/status', authorize('personnel', 'update'), ctrl.updateStatus);
router.post('/station/:stationId/roll-call', authorize('personnel', 'create'), ctrl.recordRollCall);
router.get('/station/:stationId/roll-call', authorize('personnel', 'read'), ctrl.getRollCallHistory);

module.exports = router;
