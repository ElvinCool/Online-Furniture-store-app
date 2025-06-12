const { Brand } = require('../models/models');

class BrandController {
    async create(req, res) {
        const { name } = req.body;
        const brand = await Brand.create({ name });
        return res.json(brand);
    }

    async getAll(req, res) {
        const brands = await Brand.findAll();
        return res.json(brands);
    }

    async update(req, res) {
        const { id } = req.params;
        const { name } = req.body;
        const brand = await Brand.findByPk(id);
        if (!brand) return res.status(404).json({ message: 'Бренд не найден' });

        brand.name = name;
        await brand.save();
        return res.json(brand);
    }

    async delete(req, res) {
        const { id } = req.params;
        const brand = await Brand.findByPk(id);
        if (!brand) return res.status(404).json({ message: 'Бренд не найден' });

        await brand.destroy();
        return res.json({ message: 'Бренд удалён' });
    }
}

module.exports = new BrandController();
