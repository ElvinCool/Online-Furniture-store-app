// src/components/AdminProductList.js
import React, { useEffect, useState, useContext } from 'react';
import { fetchProducts, deleteProduct } from '../http/productAPI';
import { Button, Card, Row } from 'react-bootstrap';
import { Context } from '../index';
import CreateProduct from './modals/CreateProduct';

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { product } = useContext(Context);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const { rows } = await fetchProducts(null, null, 1, 100);
        setProducts(rows);
    };

    const handleDelete = async (id) => {
        await deleteProduct(id);
        loadProducts();
    };

    const handleEdit = (prod) => {
        product.setSelectedProduct(prod);
        setEditingProduct(prod);
        setModalVisible(true);
    };

    return (
        <div>
            <h4 className="mt-4">Список товаров</h4>
            <Row className="mt-3">
                {products.map((p) => (
                    <Card key={p.id} className="p-2 m-2" style={{ width: '18rem' }}>
                        <h5>{p.name}</h5>
                        <div>Цена: {p.price}₽</div>
                        <div>Рейтинг: {p.rating}</div>
                        <Button variant="outline-primary" className="mt-2" onClick={() => handleEdit(p)}>Редактировать</Button>
                        <Button variant="outline-danger" className="mt-2" onClick={() => handleDelete(p.id)}>Удалить</Button>
                    </Card>
                ))}
            </Row>

            <CreateProduct
                show={modalVisible}
                onHide={() => {
                    setModalVisible(false);
                    setEditingProduct(null);
                    product.setSelectedProduct(null);
                    loadProducts();
                }}
                editingProduct={editingProduct}
            />
        </div>
    );
};

export default AdminProductList;
