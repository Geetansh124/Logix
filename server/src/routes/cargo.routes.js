const router = require('express').Router();
const ctrl = require('../controllers/cargo.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/expedition/:expeditionId', authorize('cargo', 'read'), ctrl.findByExpedition);
router.get('/:id', authorize('cargo', 'read'), ctrl.findById);
router.post('/', authorize('cargo', 'create'), ctrl.create);
router.patch('/:id/location', authorize('cargo', 'update'), ctrl.updateLocation);
router.post('/:id/receipt', authorize('cargo', 'update'), ctrl.confirmReceipt);
router.put('/:id/stowage-order', authorize('cargo', 'update'), ctrl.updateStowageOrder);

module.exports = router;
