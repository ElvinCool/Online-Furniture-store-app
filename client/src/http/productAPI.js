import {$authHost, $host} from "./index";
import { jwtDecode } from "jwt-decode";

export const createType = async (type) => {
    const {data} = await $authHost.post('api/type', type)
    return data
}

export const fetchTypes = async () => {
    const {data} = await $host.get('api/type')
    return data
}

export const createBrand = async (brand) => {
    const {data} = await $authHost.post('api/brand', brand)
    return data
}

export const fetchBrands = async () => {
    const {data} = await $host.get('api/brand', )
    return data
}

export const createProduct = async (product) => {
    const {data} = await $authHost.post('/api/product', product)
    return data
}

export const fetchProducts = async (typeId, brandId, page, limit= 5) => {
    const {data} = await $host.get('api/product', {params: {
            typeId, brandId, page, limit
        }})
    return data
}
 
export const fetchOneProduct = async (id) => {
    const {data} = await $authHost.get(`/api/product/${id}`);

    // Вычисление среднего рейтинга и округление до двух знаков
    const ratings = data.ratings || [];
    const averageRating = ratings.length
        ? parseFloat((ratings.reduce((sum, rating) => sum + rating.rate, 0) / ratings.length).toFixed(2))
        : 0;

    return { ...data, averageRating };
};

export const updateBrand = async (id, brand) => {
    const { data } = await $authHost.put(`api/brand/${id}`, brand);
    return data;
};

export const deleteBrand = async (id) => {
    const { data } = await $authHost.delete(`api/brand/${id}`);
    return data;
};

// --- TYPE ---
export const updateType = async (id, type) => {
    const { data } = await $authHost.put(`api/type/${id}`, type);
    return data;
};

export const deleteType = async (id) => {
    const { data } = await $authHost.delete(`api/type/${id}`);
    return data;
};

export const updateProduct = async (id, product) => {
    try {
        const { data } = await $authHost.put(`/api/product/${id}`, product);
        return data;
    } catch (error) {
        console.error('Ошибка при обновлении товара:', error);
        throw error;
    }
};


export const deleteProduct = async (id) => {
    const { data } = await $authHost.delete(`/api/product/${id}`);
    return data;
};

export const createRating = async (productId, rate) => {
    try {
        // Получаем токен (пример для localStorage, может у тебя иначе)
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Пользователь не авторизован');
        }

        // Раскодируем токен, чтобы получить userId
        const { id: userId } = jwtDecode(token);

        // Отправляем запрос на создание рейтинга с userId из токена
        const response = await $authHost.post('/rating', { 
            productId, 
            rate, 
            userId 
        });

        // Получаем обновлённый товар с рейтингом
        const updatedProduct = await fetchOneProduct(productId);
        return updatedProduct;
    } catch (error) {
        console.error('Ошибка при создании рейтинга:', error);
        throw error;
    }
};