const Router = require('express');
const router = new Router();
const brandController = require('../controllers/brandController');

// уже существующие
router.post('/', brandController.create);
router.get('/', brandController.getAll);

// новые:
router.put('/:id', brandController.update); // Обновление
router.delete('/:id', brandController.delete); // Удаление

module.exports = router;
