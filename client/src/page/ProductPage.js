import React, { useEffect, useState, useContext } from 'react';
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import bigStar from '../assets/bigStar.png';
import { useParams } from 'react-router-dom';
import { fetchOneProduct } from "../http/productAPI";
import { useHistory } from 'react-router-dom';
import { Context } from '..';

const ProductPage = () => {
    const [product, setProduct] = useState({ info: [], rating: 0 });
    const [quantity, setQuantity] = useState(1); // Состояние для количества товара
    const [rating, setRating] = useState(0); // Состояние для рейтинга
    const { id } = useParams();
    
    useEffect(() => {
        fetchOneProduct(id).then(data => {
            console.log("Fetched product data:", data); // Логируем полученные данные
            setProduct(data);
        });
    }, [id]);

    const history = useHistory();
    const { basket } = useContext(Context);

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const submitRating = async (rate) => {
        // Проверяем, что рейтинг является числом
        if (isNaN(rate)) {
            console.error('Неверный формат рейтинга:', rate);
            return;
        }
   
        try {
            const response = await fetch('/api/rating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    productId: product.id,
                    rate: parseFloat(rate), // Убедимся, что это число с плавающей запятой
                    userId: localStorage.getItem('userId')
                })
            });
   
            const data = await response.json();
            console.log('Response from server:', data);
   
            if (response.ok) {
                const updatedProduct = await fetchOneProduct(product.id);
                setProduct(updatedProduct); // Обновляем продукт
            } else {
                console.error('Ошибка:', data.message);
            }
        } catch (error) {
            console.error('Ошибка при отправке рейтинга:', error);
        }
    };

    return (
        <Container className="mt-3">
            <Row>
                <Col md={4}>
                    <Image width={300} height={300} src={process.env.REACT_APP_API_URL + product.img} />
                </Col>
                <Col md={4}>
                    <Row className="d-flex flex-column align-items-center">
                        <h2>{product.name}</h2>
                        <div
                            className="d-flex align-items-center justify-content-center"
                            style={{ background: `url(${bigStar}) no-repeat center center`, width: 240, height: 240, backgroundSize: 'cover', fontSize: 64 }}
                        >
                            {product.rating}
                        </div>
                    </Row>
                </Col>
                <Col md={4}>
                    <Card
                        className="d-flex flex-column align-items-center justify-content-around"
                        style={{ width: 300, height: 300, fontSize: 32, border: '5px solid lightgray' }}
                    >
                        <h3>От: {product.price} руб.</h3>
                        <Button
                            variant={"outline-dark"}
                            onClick={async () => {
                                await basket.addItem({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    quantity: quantity
                                });
                            }}
                        >
                            Добавить в корзину
                        </Button>
                    </Card>
                </Col>
            </Row>
            <Row className="d-flex flex-column align-items-center mt-3">
                <h3>Оцените товар</h3>
                <div className="rating-container">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => setRating(star)} // Устанавливаем рейтинг при клике
                            className="star"
                            style={{
                                fontSize: 30,
                                cursor: 'pointer',
                                color: star <= rating ? 'gold' : 'gray', // Цвет звезд
                                transition: 'color 0.3s',
                            }}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <Button
                    variant="outline-success"
                    onClick={() => submitRating(rating)} // Отправка рейтинга
                    disabled={rating === 0} // Отключаем кнопку, если рейтинг не выбран
                >
                    Оставить рейтинг
                </Button>
            </Row>
            <Row className="d-flex flex-column m-3">
                <h1>Характеристики</h1>
                {product.info.map((info, index) =>
                    <Row key={info.id} style={{ background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10 }}>
                        {info.title}: {info.description}
                    </Row>
                )}
            </Row>
        </Container>
    );
};

export default ProductPage;