const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { Product, Type, Brand } = require('../models/models');

class InvoiceController {
    async downloadInvoice(req, res) {
        try {
            const products = await Product.findAll({
                include: [Type, Brand]
            });

            const doc = new PDFDocument({ margin: 40 });
            const filePath = path.resolve(__dirname, '..', 'static', 'invoice.pdf');
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // Подключаем шрифт
            const fontPath = path.resolve(__dirname, '..', 'fonts', 'DejaVuSans.ttf');
            doc.font(fontPath);

            // Заголовок
            doc.fontSize(18).text('Накладная по товарам', { align: 'center' });
            doc.moveDown(1);

            // Таблица заголовков
            const tableTop = doc.y;
            const columnPositions = {
                index: 50,
                name: 90,
                type: 250,
                brand: 360,
                price: 470
            };

            doc.fontSize(12).text('№', columnPositions.index, tableTop);
            doc.text('Название', columnPositions.name, tableTop);
            doc.text('Тип', columnPositions.type, tableTop);
            doc.text('Бренд', columnPositions.brand, tableTop);
            doc.text('Цена (₽)', columnPositions.price, tableTop, { align: 'right' });

            doc.moveTo(40, doc.y + 5).lineTo(550, doc.y + 5).stroke();
            doc.moveDown(0.5);

            products.forEach((product, i) => {
                const y = doc.y;
                doc.fontSize(11);
                doc.text(i + 1, columnPositions.index, y);
                doc.text(product.name, columnPositions.name, y, { width: 150 });
                doc.text(product.type.name, columnPositions.type, y);
                doc.text(product.brand.name, columnPositions.brand, y);
                doc.text(`${product.price}`, columnPositions.price, y, { align: 'right' });
                doc.moveDown(0.4);
            });

            // Нижний колонтитул с датой
            doc.moveDown(2);
            doc.fontSize(10).text(`Дата создания: ${new Date().toLocaleDateString()}`, { align: 'right' });

            doc.end();

            stream.on('finish', () => {
                res.download(filePath, 'invoice.pdf');
            });
        } catch (error) {
            console.error('Ошибка генерации PDF:', error);
            res.status(500).json({ message: 'Ошибка генерации PDF' });
        }
    }
}

module.exports = new InvoiceController();