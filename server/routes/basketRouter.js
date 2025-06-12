const Router = require('express');
const router = new Router();
const basketController = require('../controllers/basketController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, basketController.add);
router.get('/', authMiddleware, basketController.getBasket);
router.delete('/:productId', authMiddleware, basketController.remove);

module.exports = router;