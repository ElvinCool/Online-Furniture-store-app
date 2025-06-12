import {$authHost} from "./index"; // авторизованный хост с токеном

export const addToBasket = async (productId) => {
    const {data} = await $authHost.post('api/basket', {productId});
    return data;
};

export const fetchBasket = async () => {
    const {data} = await $authHost.get('api/basket');
    return data;
};

export const removeFromBasket = async (productId) => {
    const {data} = await $authHost.delete(`api/basket/${productId}`);
    return data;
};