const {Basket, BasketProduct, Product} = require('../models/models');

class BasketController {
    async add(req, res) {
        const userId = req.user.id;
        const {productId} = req.body;

        let basket = await Basket.findOne({where: {userId}});
        if (!basket) {
            basket = await Basket.create({userId});
        }

        let basketProduct = await BasketProduct.findOne({where: {basketId: basket.id, productId}});
        if (basketProduct) {
            basketProduct.quantity += 1;
            await basketProduct.save();
        } else {
            basketProduct = await BasketProduct.create({basketId: basket.id, productId});
        }

        return res.json(basketProduct);
    }

    async getBasket(req, res) {
        const userId = req.user.id;
        const basket = await Basket.findOne({
            where: {userId},
            include: {
                model: BasketProduct,
                include: [Product]
            }
        });

        return res.json(basket);
    }

    async remove(req, res) {
        const userId = req.user.id;
        const {productId} = req.params;
        const basket = await Basket.findOne({where: {userId}});
        await BasketProduct.destroy({where: {basketId: basket.id, productId}});
        return res.json({message: 'Товар удалён'});
    }
}

module.exports = new BasketController();