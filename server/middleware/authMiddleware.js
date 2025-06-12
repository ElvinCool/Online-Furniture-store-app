const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Не авторизован: заголовок отсутствует" });
        }

        const token = authHeader.split(' ')[1]; // ожидается формат: "Bearer TOKEN"
        if (!token) {
            return res.status(401).json({ message: "Не авторизован: токен не найден" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;  // Вставляем информацию о пользователе в запрос
        next();
    } catch (e) {
        console.error("Ошибка в authMiddleware:", e.message);
        return res.status(401).json({ message: "Не авторизован: ошибка валидации токена" });
    }
};