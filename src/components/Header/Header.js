import React from "react"
import {useHistory} from 'react-router-dom'


import './styles.css'

import logo from '../assets/logo.png'


export default function Header(){
    const history = useHistory()

    function handleFavorites(){
        history.push('/favorites')
    }

    return(
        <div>
            <div className="container header">
                <a href="/"><img className="logo" src={logo} alt="logoBook"/></a>
                <div className="header-content">
                    <h1 className="title">Google Book Search</h1>
                    <h3 className="subtitle">Find the book you want</h3>
                </div>
                <div className="favorite">
                    <button onClick={()=>handleFavorites()} className="button">Favorites</button>
                </div>
            </div>

        </div>
    )
}
