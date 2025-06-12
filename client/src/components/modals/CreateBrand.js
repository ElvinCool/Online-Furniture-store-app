import React, { useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Form, ListGroup, Row, Col } from "react-bootstrap";
import { createBrand, fetchBrands, updateBrand, deleteBrand } from "../../http/productAPI";

const CreateBrand = ({ show, onHide }) => {
    const [value, setValue] = useState('');
    const [brands, setBrands] = useState([]);
    const [editing, setEditing] = useState(null); // id редактируемого бренда

    useEffect(() => {
        if (show) {
            loadBrands();
            resetForm();
        }
    }, [show]);

    const loadBrands = () => {
        fetchBrands().then(data => setBrands(data));
    };

    const resetForm = () => {
        setValue('');
        setEditing(null);
    };

    const addOrUpdateBrand = () => {
        if (!value.trim()) return;

        if (editing) {
            updateBrand(editing, { name: value }).then(() => {
                resetForm();
                loadBrands();
            });
        } else {
            createBrand({ name: value }).then(() => {
                resetForm();
                loadBrands();
            });
        }
    };

    const removeBrand = (id) => {
        deleteBrand(id).then(() => loadBrands());
    };

    const startEdit = (brand) => {
        setValue(brand.name);
        setEditing(brand.id);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Управление брендами
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Введите название бренда"
                        className="mb-3"
                    />
                    <Button variant="outline-success" onClick={addOrUpdateBrand}>
                        {editing ? 'Сохранить' : 'Добавить'}
                    </Button>
                    {editing && (
                        <Button variant="outline-secondary" className="ms-2" onClick={resetForm}>
                            Отмена
                        </Button>
                    )}
                </Form>
                <hr />
                <ListGroup>
                    {brands.map(brand => (
                        <ListGroup.Item key={brand.id}>
                            <Row>
                                <Col>{brand.name}</Col>
                                <Col className="text-end">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => startEdit(brand)}
                                        className="me-2"
                                    >
                                        Редактировать
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => removeBrand(brand.id)}
                                    >
                                        Удалить
                                    </Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateBrand;
