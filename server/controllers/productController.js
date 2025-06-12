const uuid = require('uuid')
const path = require('path');
const {Product, ProductInfo} = require('../models/models')
const ApiError = require('../error/ApiError');

class ProductController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            const product = await Product.create({name, price, brandId, typeId, img: fileName});

            if (info) {
                info = JSON.parse(info)
                info.forEach(i =>
                    ProductInfo.create({
                        title: i.title,
                        description: i.description,
                        productId: product.id
                    })
                )
            }

            return res.json(product)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res) {
        let {brandId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let products;
        if (!brandId && !typeId) {
            products = await Product.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            products = await Product.findAndCountAll({where:{brandId}, limit, offset})
        }
        if (!brandId && typeId) {
            products = await Product.findAndCountAll({where:{typeId}, limit, offset})
        }
        if (brandId && typeId) {
            products = await Product.findAndCountAll({where:{typeId, brandId}, limit, offset})
        }
        return res.json(products)
    }

    async getOne(req, res) {
        const {id} = req.params
        const product = await Product.findOne(
            {
                where: {id},
                include: [{model: ProductInfo, as: 'info'}]
            },
        )
        return res.json(product)
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            if (!product) return res.status(404).json({ message: 'Товар не найден' });

            const { name, price, rating, brandId, typeId, info } = req.body;

            product.name = name || product.name;
            product.price = price || product.price;
            product.rating = rating || product.rating;
            product.brandId = brandId || product.brandId;
            product.typeId = typeId || product.typeId;

            if (req.files && req.files.img) {
                const fileName = uuid.v4() + ".jpg";
                const filePath = path.resolve(__dirname, '..', 'static', fileName);
                req.files.img.mv(filePath);
                product.img = fileName;
            }

            await product.save();

            if (info) {
                await ProductInfo.destroy({ where: { productId: product.id } });
                const parsedInfo = JSON.parse(info);
                parsedInfo.forEach(i =>
                    ProductInfo.create({
                        title: i.title,
                        description: i.description,
                        productId: product.id
                    })
                );
            }

            return res.json(product);
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async delete(req, res) {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ message: 'Товар не найден' });

        await Product.destroy({ where: { id } });
        return res.json({ message: 'Товар удалён' });
    }
}

module.exports = new ProductController()