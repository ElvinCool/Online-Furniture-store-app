import { observer } from "mobx-react-lite";
import React, {useContext} from 'react';
import {Context} from "../index";
import { Card, Row, Col, Image } from "react-bootstrap";
import star from '../assets/star.png'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { PRODUCT_ROUTE } from "../utils/consts";

const ProductItem = ({product}) => {
    const history = useHistory()
    return (
        <Col md={3} className="mt-3" onClick={( )=> history.push(PRODUCT_ROUTE + '/' + product.id)}>
            <Card style={{width: 150, cursor: 'pointer'}} border={"light"}>
                <Image width={150} height= {150} src={process.env.REACT_APP_API_URL + product.img}/>
                <div className="text-black-50 d-flex mt-1 justify-content-between align-items-center">
                    <div></div>
                    <div className='d-flex align-items-center'>
                        <div>{product.rating}</div>
                        <Image width={18} height={18} src={star} />
                    </div>
                </div>
                <div>
                        <div>{product.name}</div>
                    </div>
            </Card>
        </Col>
    );
};

export default ProductItem;