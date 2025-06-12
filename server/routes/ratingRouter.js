const Router = require('express');
const { Rating, Product, User } = require('../models/models'); // Импорт моделей
const authMiddleware = require('../middleware/authMiddleware');
const router = new Router();

// Маршрут для добавления рейтинга
router.post('/', authMiddleware, async (req, res) => {
    const { productId, rate } = req.body;
    const userId = req.user?.id;

    try {
        console.log('Получен рейтинг:', { productId, rate, userId });

        // Проверяем, что пользователь авторизован
        if (!userId) {
            return res.status(401).json({ message: 'Пользователь не авторизован' });
        }

        // Проверяем, что все данные переданы
        if (!productId || !rate) {
            return res.status(400).json({ message: 'Отсутствуют обязательные поля' });
        }

        // Проверяем, что пользователь существует
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }

        // Проверяем, что товар существует
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(400).json({ message: 'Товар не найден' });
        }

        // Создаем новый рейтинг
        const newRating = await Rating.create({
            rate,
            productId,
            userId
        });

        // Получаем все рейтинги товара
        const ratings = await Rating.findAll({ where: { productId } });
        const averageRating = ratings.reduce((sum, rating) => sum + rating.rate, 0) / ratings.length;

        // Обновляем средний рейтинг товара
        product.rating = averageRating;
        await product.save();

        return res.status(200).json({
            message: 'Рейтинг добавлен успешно',
            rating: newRating,
            averageRating
        });
    } catch (error) {
        console.error('Ошибка при добавлении рейтинга:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;
