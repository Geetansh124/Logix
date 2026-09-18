const router = require('express').Router();
const ctrl = require('../controllers/expedition.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/', authorize('expedition', 'read'), ctrl.findAll);
router.get('/:id', authorize('expedition', 'read'), ctrl.findById);
router.get('/:id/stowage-plan', authorize('cargo', 'read'), ctrl.getStowagePlan);
router.post('/', authorize('expedition', 'create'), ctrl.create);
router.put('/:id', authorize('expedition', 'update'), ctrl.update);
router.delete('/:id', authorize('expedition', 'delete'), ctrl.delete);

module.exports = router;
