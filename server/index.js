require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandingMiddleware')
const path = require('path')
const basketRouter = require('./routes/basketRouter');
const ratingRouter = require('./routes/ratingRouter'); // Импортируем маршрут для рейтингов
const PORT = process.env.PORT || 5500

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))

// Подключаем новые маршруты
app.use('/api/basket', basketRouter);
app.use('/api/rating', ratingRouter); // Подключаем маршрут для рейтингов
app.use('/api', router)

// Обработка ошибок
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start();
