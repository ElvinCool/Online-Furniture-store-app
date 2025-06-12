import React, { useContext, useEffect } from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import pdfMake from 'pdfmake/build/pdfmake';
import { vfs } from 'pdfmake/build/vfs_fonts'; // Подключаем шрифты для pdfMake
pdfMake.vfs = vfs;
// Если у вас есть свой шрифт Roboto-Medium.ttf в формате base64, добавьте его так:
// pdfMake.vfs['Roboto-Medium.ttf'] = YOUR_FONT_FILE_CONTENT;

const Basket = observer(() => {
    const { basket, userInfo } = useContext(Context);

    // Загружаем корзину при монтировании компонента
    useEffect(() => {
        basket.fetchBasket();
    }, [basket]);

    // Функция для подсчета общей стоимости корзины
    const getTotalPrice = () => {
        return basket.items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const downloadOrder = () => {
        const orderDetails = basket.items.map(item => {
            return `
            Товар: ${item.name}
            Цена: ${item.price}₽
            Количество: ${item.quantity}
            Итого: ${item.price * item.quantity}₽\n\n
            `;
        }).join('');
    
        const totalPrice = getTotalPrice();
    
        const documentDefinition = {
            content: [
                {
                    text: `Ваш заказ `,
                    style: 'header',
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                },
                {
                    text: 'Товары:',
                    style: 'subheader',
                    margin: [0, 10, 0, 5]
                },
                {
                    table: {
                        widths: ['*', 'auto', 'auto', 'auto'],
                        body: [
                            ['Название', 'Цена', 'Кол-во', 'Итого'],
                            ...basket.items.map(item => [
                                item.name,
                                `${item.price}₽`,
                                item.quantity,
                                `${item.price * item.quantity}₽`
                            ])
                        ]
                    }
                },
                {
                    text: `Общая сумма: ${totalPrice}₽`,
                    style: 'total',
                    margin: [0, 20, 0, 0]
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                },
                subheader: {
                    fontSize: 12,
                    margin: [0, 5, 0, 5]
                },
                total: {
                    fontSize: 14,
                    bold: true
                }
            }
        };
    
        // Генерация PDF и скачивание
        pdfMake.createPdf(documentDefinition).download('order.pdf');
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Корзина</h2>
            {basket.items.length === 0 ? (
                <p>Корзина пуста. Добавьте товары!</p>
            ) : (
                <div>
                    {basket.items.map(item => (
                        <Card key={item.id} className="mb-3 shadow-sm">
                            <Row className="g-0">
                                <Col md={8}>
                                    <Card.Body>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Text>Цена: {item.price}₽</Card.Text>
                                        <Card.Text>Количество: {item.quantity}</Card.Text>
                                        <Card.Text>Итого: {item.price * item.quantity}₽</Card.Text>
                                        <Button 
                                            variant="danger" 
                                            onClick={() => basket.removeItem(item.id)} 
                                        >
                                            Удалить
                                        </Button>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                    <div className="d-flex justify-content-between mt-4">
                        <h3>Общая сумма:</h3>
                        <h3>{getTotalPrice()}₽</h3>
                    </div>

                    {/* Кнопка для оформления заказа */}
                    <Button 
                        variant="success" 
                        onClick={downloadOrder} 
                        className="mt-4"
                    >
                        Оформить заказ
                    </Button>
                </div>
            )}
        </Container>
    );
});

export default Basket;