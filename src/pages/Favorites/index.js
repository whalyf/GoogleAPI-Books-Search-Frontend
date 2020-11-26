import React, { useEffect, useState } from 'react'
import { FiXCircle, FiStar } from 'react-icons/fi';

import './styles.css'

import Header from '../../components/Header/Header'


export default function Favorites() {
    const [arrayBooks, setArrayBooks] = useState([])
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        setArrayBooks(JSON.parse(localStorage.getItem('@google-book-search/books'))) 
    }, [refresh])


    function handleDeleteFavorite(book) {
        arrayBooks.splice(arrayBooks.indexOf(book), 1)
        localStorage.removeItem('@google-book-search/books')
        
        if(!!arrayBooks.length){
            localStorage.setItem('@google-book-search/books', JSON.stringify(arrayBooks))
            setArrayBooks(arrayBooks)
        }
        setRefresh(!refresh)
    }

 
    return (
        <div className="all-page">
            <Header />
            <div className="favorite-title">
                <h2>
                    <FiStar size={20} color="#c2801e" />
                    Your Favorite Books
                    <FiStar size={20} color="#c2801e" />
                </h2>
            </div>
            <div>
                {!!arrayBooks && !!arrayBooks.length ?(
                    <>
                        <div className="favorite-list">
                            <div className="all-books">
                            {arrayBooks.map(arrayBook => {
                                return (
                                    <div className="each-book" key={arrayBook.id} >
                                                <div className="item">
                                                    {arrayBook.volumeInfo.imageLinks === undefined ? (<></>) : (<img src={arrayBook.volumeInfo.imageLinks.thumbnail} alt={arrayBook.volumeInfo.title} />)}
                                                    <strong>{arrayBook.volumeInfo.title}</strong>
                                                    <span>{arrayBook.volumeInfo.authors}</span>
                                                </div>
                                            <div className="button-container">
                                                <button className="button" onClick={() => handleDeleteFavorite(arrayBook)}>
                                                    <FiXCircle size={20} color="#fff" />
                                                    Remove
                                                </button>
                                            </div> 
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </> 
                ) : (                        
                        <h2 className="no-book">
                            No Books...
                        </h2>
                    )
                }
            </div>
        </div>
    )
}
