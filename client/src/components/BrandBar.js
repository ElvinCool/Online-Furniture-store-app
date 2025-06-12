import { observer } from "mobx-react-lite";
import React, {useContext} from 'react';
import {Context} from "../index";
import { Card, Row, Col } from "react-bootstrap";

const BrandBar = observer(() => {
    const {product} = useContext(Context)
    return (
        <Row className="d-flex flex-row">
    {product.brands.map(brand =>
        <Col key={brand.id} xs="auto">
            <Card
                className="p-3"
                style={{ cursor: 'pointer' }}
                border={brand.id === product.selectedBrand.id ? 'danger' : 'light'}
                onClick={() => product.setSelectedBrand(brand)}
            >
                {brand.name}
            </Card>
        </Col>
    )}
</Row>
    );
});

export default BrandBar;