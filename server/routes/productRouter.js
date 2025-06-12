const Router = require('express');
const router = new Router();
const productController = require('../controllers/productController')
const checkRole = require('../middleware/checkRoleMiddleware')
const invoiceController = require('../controllers/invoiceController');

router.get('/invoice', invoiceController.downloadInvoice);
router.post('/', checkRole('ADMIN'), productController.create);

router.get('/', productController.getAll);
router.put('/:id', checkRole('ADMIN'), productController.update);
router.delete('/:id', checkRole('ADMIN'), productController.delete);

router.get('/:id', productController.getOne);

module.exports = router;