const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');  // Подключаем ApiError для более удобной обработки ошибок

module.exports = function(role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            return next();
        }
        
        try {
            // Получаем токен из заголовка Authorization
            const token = req.headers.authorization.split(' ')[1]; // Пример: Bearer asfasnfkajsfnjk
            if (!token) {
                return next(ApiError.unauthorized('Токен не найден'));  // Используем ApiError для авторизации
            }
            
            // Расшифровка токена
            const decoded = jwt.verify(token, process.env.SECRET_KEY);  // Проверка токена на соответствие с SECRET_KEY
            if (decoded.role !== role) {
                return next(ApiError.forbidden('Нет доступа, недостаточно прав'));
            }

            req.user = decoded;  // Сохраняем информацию о пользователе в запрос
            next();  // Дальше по цепочке
        } catch (e) {
            return next(ApiError.unauthorized('Ошибка валидации токена'));
        }
    };
};