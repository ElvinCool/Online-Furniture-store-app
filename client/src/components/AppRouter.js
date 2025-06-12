import React, { useContext } from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import { authRoutes, publicRoutes } from '../routes';
import Admin from '../page/Admin';
import Basket from '../page/Basket';
import Shop from '../page/Shop';
import Auth from '../page/Auth';
import ProductPage from '../page/ProductPage';
import { SHOP_ROUTE } from '../utils/consts';
import { Context } from '..';
import { observer } from 'mobx-react-lite';

const AppRouter = observer(() => {
    const {user} = useContext(Context)

    console.log(user)
    return (
        <Switch>
            {user.isAuth && authRoutes.map(({path, Component}) =>
                <Route key={path} path={path} component={Component} exact />
            )}
            {publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} component={Component} exact />
            )}
            <Redirect to = {SHOP_ROUTE}/>
        </Switch>
    );
});

export default AppRouter;