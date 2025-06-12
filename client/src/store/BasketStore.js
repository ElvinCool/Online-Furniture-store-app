import {makeAutoObservable} from "mobx";
import {addToBasket, fetchBasket, removeFromBasket} from "../http/basketAPI";

export default class BasketStore {
    constructor() {
        this._items = [];
        makeAutoObservable(this);
    }

    setItems(items) {
        this._items = items;
    }

    get items() {
        return this._items;
    }

    async fetchBasket() {
        const data = await fetchBasket();
        this.setItems(data.basket_products.map(bp => ({
            id: bp.product.id,
            name: bp.product.name,
            price: bp.product.price,
            quantity: bp.quantity
        })));
    }

    async addItem(product) {
        await addToBasket(product.id);
        await this.fetchBasket(); // сразу обновляем
    }

    async removeItem(productId) {
        await removeFromBasket(productId);
        await this.fetchBasket();
    }
}