import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button, Dropdown, Form, Row, Col } from 'react-bootstrap';
import { Context } from '../../index';
import { createProduct, fetchBrands, fetchTypes, updateProduct, deleteProduct } from '../../http/productAPI';
import { observer } from 'mobx-react-lite';

const CreateProduct = observer(({ show, onHide, editingProduct = null }) => {
    const { product } = useContext(Context);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [file, setFile] = useState(null);
    const [rating, setRating] = useState(0); // Добавляем состояние для рейтинга
    const [info, setInfo] = useState([]);

    useEffect(() => {
        fetchTypes().then(data => product.setTypes(data));
        fetchBrands().then(data => product.setBrands(data));
    
        if (editingProduct) {
            setName(editingProduct.name);
            setPrice(editingProduct.price);
            setRating(editingProduct.rating);
            product.setSelectedBrand({ id: editingProduct.brandId, name: '' });
            product.setSelectedType({ id: editingProduct.typeId, name: '' });
            // Можно дополнить загрузкой info при необходимости
        } else {
            setName('');
            setPrice(0);
            setRating(0);
            product.setSelectedBrand({});
            product.setSelectedType({});
        }
    }, [editingProduct]);
    

    const addInfo = () => {
        setInfo([...info, { title: '', description: '', number: Date.now() }]);
    };

    const removeInfo = (number) => {
        setInfo(info.filter((i) => i.number !== number));
    };

    const changeInfo = (key, value, number) => {
        setInfo(info.map((i) => (i.number === number ? { ...i, [key]: value } : i)));
    };

    const selectFile = (e) => {
        setFile(e.target.files[0]);
    };

    const addProduct = () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', `${price}`);
        formData.append('rating', `${rating}`);
        if (file) formData.append('img', file);
        formData.append('brandId', product.selectedBrand.id);
        formData.append('typeId', product.selectedType.id);
        formData.append('info', JSON.stringify(info));
    
        const action = editingProduct
            ? updateProduct(editingProduct.id, formData)
            : createProduct(formData);
    
        action.then(() => onHide());
    };
    

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Управление продуктами</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{product.selectedType.name || 'Выберите тип'}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {product.types.map((type) => (
                                <Dropdown.Item onClick={() => product.setSelectedType(type)} key={type.id}>
                                    {type.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{product.selectedBrand.name || 'Выберите брэнд'}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {product.brands.map((brand) => (
                                <Dropdown.Item onClick={() => product.setSelectedBrand(brand)} key={brand.id}>
                                    {brand.name}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-3"
                        placeholder="Введите название устройства"
                    />
                    <Form.Control
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="mt-3"
                        placeholder="Введите стоимость устройства"
                        type="number"
                    />
                    <Form.Control className="mt-3" type="file" onChange={selectFile} />
                    <hr />
                    <Button variant={'outline-dark'} onClick={addInfo}>
                        Добавить новое свойство
                    </Button>
                    {info.map((i) => (
                        <Row className="mt-4" key={i.number}>
                            <Col md={4}>
                                <Form.Control
                                    value={i.title}
                                    onChange={(e) => changeInfo('title', e.target.value, i.number)}
                                    placeholder="Введите название свойства"
                                />
                            </Col>
                            <Col md={4}>
                                <Form.Control
                                    value={i.description}
                                    onChange={(e) => changeInfo('description', e.target.value, i.number)}
                                    placeholder="Введите описание свойства"
                                />
                            </Col>
                            <Col md={4}>
                                <Button onClick={() => removeInfo(i.number)} variant={'outline-danger'}>
                                    Удалить
                                </Button>
                            </Col>
                        </Row>
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>
                    Закрыть
                </Button>
                <Button variant="outline-success" onClick={addProduct}>
                    Добавить
                </Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateProduct;