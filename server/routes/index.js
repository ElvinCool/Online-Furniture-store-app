const Router = require('express')
const router = new Router()
const productRouter = require ('./productRouter')
const userRouter = require ('./userRouter')
const typeRouter = require ('./typeRouter')
const brandRouter = require ('./brandRouter')
const basketRouter = require('./basketRouter');
const invoiceController = require('../controllers/invoiceController');

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/basket', basketRouter)
router.get('/invoice', invoiceController.downloadInvoice);
router.use('/product', productRouter)

module.exports = router