import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Home from './pages/Home'
import Favorites from './pages/Favorites/'

export default function Routes(){
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component = {Home}></Route>
                <Route path="/favorites" component = {Favorites}></Route>
            </Switch>
        </BrowserRouter>
    )
}