import React,{useState, useEffect} from 'react';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { FiPlusCircle, FiStar, FiXCircle } from 'react-icons/fi';
import { AiFillStar} from 'react-icons/ai';

import './styles.css';
import '../../global.css';
import placeholder from '../../assets/placeholder.jpg';
import Header from '../../components/Header/Header'

export default function Home(){
    const [informations, setInformations] = useState(false);
    const [index, setIndex] = useState(0);
    const [name, setName] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [book, setBook] = useState([]);
    const [bookItems, setBookItems] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const maxResults = 12;

    async function handleSearch(page = 0){
        if(!page){
            setIndex(0);
        }

        try {
            await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${name}&maxResults=${maxResults}&startIndex=${page}`)
            .then(response => {
            setTotalPages(Math.ceil(response.data.totalItems / maxResults));
            if (response.data.items.length > 0) {
                setBookItems(response.data.items);
            }else{
                setBookItems([])
            }
            setInformations(false);   

          })
        } catch (err) {
            console.error('Home.handleSearch', err);
        }
    }

    function handleMoreInfos(selectedBook) {
        setBook(selectedBook);
        setInformations(true);    
    }

    function handleFavorites(selectedBook){      
        //Primeiro consulta se já há algo armazenado no storage        
        //Caso nada esteja armazenado no storage, faz-se o insert do primeiro ID
        if(localStorage.getItem('@google-book-search/books') === null || localStorage.getItem('@google-book-search/books') === `[]`){
            localStorage.setItem('@google-book-search/books', JSON.stringify([selectedBook]));
        }
        //Caso contrário, se já houver algo no storage deve-se concatenar os valores antigos 
        //com o novo valor e em seguida realizar o setItem no novo localStorage
        else{
            if(localStorage.getItem('@google-book-search/books') && localStorage.getItem('@google-book-search/books').indexOf(selectedBook.id) === -1){
                localStorage.setItem(
                    '@google-book-search/books',
                    // O JSON.parse transforma a string em JSON novamente, o inverso do JSON.strigify
                    JSON.stringify([
                      ...JSON.parse(localStorage.getItem('@google-book-search/books')),
                      selectedBook
                    ])
                );
            }
        }
        setRefresh(!refresh)
    }

    function changePage(page){
        handleSearch((page.selected * maxResults) + 1);
        setIndex(page.selected);
    }

    useEffect(()=>{},[refresh,bookItems]);

    return(
        <div className="page">
            <Header/>
            <section className="search">
                <div className="input-block">
                    <input
                    placeholder="Make your search..."
                        type="text"
                        name="Books"
                        label="Book"
                        required={true}
                        value={name}
                        onChange={event => setName(event.target.value)}
                    />
                    <button className="button" type="button" onClick={()=>handleSearch()}>
                        Search
                    </button>
                </div>
            </section>
            <main>
                {!informations ?(
                    <>
                        <div className="book-content">
                            {bookItems.map(selectedBook => (
                                <div className="each-book" key={selectedBook.id} >
                                    <div className="item">
                                        <img src={selectedBook.volumeInfo.imageLinks === undefined ? placeholder : selectedBook.volumeInfo.imageLinks.thumbnail} alt={selectedBook.volumeInfo.title}/>
                                        <strong>{selectedBook.volumeInfo.title}</strong>
                                        <span>{selectedBook.volumeInfo.authors}</span> 
                                    </div>
                                    <div className="button-container">
                                        <button className="button" onClick={() => handleFavorites(selectedBook)}>
                                            {!!localStorage.getItem('@google-book-search/books') && localStorage.getItem('@google-book-search/books').indexOf(selectedBook.id) !== -1?
                                                <AiFillStar size={20} color="#FFF" /> 
                                            :
                                                <FiStar size={20} color="#FFF" /> 
                                            }
                                            Fav
                                        </button>
                                        <button className="button" onClick={() => handleMoreInfos(selectedBook)}>
                                            <FiPlusCircle size={20} color="#FFF"/> More
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <ReactPaginate
                            containerClassName={'pagination'}
                            forcePage={index}
                            pageCount={totalPages}
                            pageRangeDisplayed={4}
                            marginPagesDisplayed={0}
                            nextClassName={'btn-next'}
                            previousClassName={'btn-prev'}
                            breakClassName={'btn-break'}
                            onPageChange={e => {
                                changePage(e)}
                            } 
                        />
                    </>
                ):(
                    <div className="each-book book-details" >
                        <div class-name="photo-titles">
                            <img src={book.volumeInfo.imageLinks === undefined ? placeholder : book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title}/>
                            <div className="title-subtitle">
                                <strong>Title: {book.volumeInfo.title}</strong>
                                <span>Author: {book.volumeInfo.authors}</span>
                            </div>
                        </div>
                        {!!book.volumeInfo.description && <p><strong>Description:</strong> {book.volumeInfo.description}</p>}
                        {!!book.volumeInfo.language && <p><strong>Language:</strong> {book.volumeInfo.language}</p>}
                        {!!book.volumeInfo.pageCount && <p><strong>Pages</strong> {book.volumeInfo.pageCount}</p>}
                        {!!book.volumeInfo.publisher && <p><strong>Company:</strong> {book.volumeInfo.publisher}</p>}
                        {!!book.saleInfo.listPrice && <p><strong>Price:</strong> R$ {book.saleInfo.listPrice.amount}</p>} 
                        {!!book.volumeInfo.previewLink &&<p><strong>Link:</strong> <a rel="noreferrer" target="_blank" href={book.volumeInfo.previewLink}>Open a preview</a></p>}
                        {!!book.volumeInfo.infoLink &&<p><strong>Informations:</strong> <a target="_blank" rel="noreferrer" href={book.volumeInfo.infoLink}>See it on google market</a></p>}
                        <button className="button" onClick={() => setInformations(false)}>
                            <FiXCircle size={22} color="#FFF"/>Back
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}