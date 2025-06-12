import React, { useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Form, ListGroup, Row, Col } from "react-bootstrap";
import { createType, fetchTypes, updateType, deleteType } from "../../http/productAPI";

const CreateType = ({ show, onHide }) => {
    const [value, setValue] = useState('');
    const [types, setTypes] = useState([]);
    const [editing, setEditing] = useState(null); // id редактируемого типа

    useEffect(() => {
        if (show) {
            loadTypes();
            resetForm();
        }
    }, [show]);

    const loadTypes = () => {
        fetchTypes().then(data => setTypes(data));
    };

    const resetForm = () => {
        setValue('');
        setEditing(null);
    };

    const addOrUpdateType = () => {
        if (!value.trim()) return;

        if (editing) {
            updateType(editing, { name: value }).then(() => {
                resetForm();
                loadTypes();
            });
        } else {
            createType({ name: value }).then(() => {
                resetForm();
                loadTypes();
            });
        }
    };

    const removeType = (id) => {
        deleteType(id).then(() => loadTypes());
    };

    const startEdit = (type) => {
        setValue(type.name);
        setEditing(type.id);
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Управление типами
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Введите название типа"
                        className="mb-3"
                    />
                    <Button variant="outline-success" onClick={addOrUpdateType}>
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
                    {types.map(type => (
                        <ListGroup.Item key={type.id}>
                            <Row>
                                <Col>{type.name}</Col>
                                <Col className="text-end">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => startEdit(type)}
                                        className="me-2"
                                    >
                                        Редактировать
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => removeType(type.id)}
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

export default CreateType;
