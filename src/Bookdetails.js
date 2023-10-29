import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'; 
import axios from 'axios';
import './BookDetails.css'; // You can create a CSS file for BookDetails styles

function BookDetails() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [cart, setCart] = useState([]); 
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    console.log('bookId:', bookId); // Check if bookId is being correctly passed

    // Read cart data from localStorage when the component mounts
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    axios
      .get(`http://127.0.0.1:5000/books/${bookId}`)
      .then((response) => {
        console.log('Fetched data:', response.data); // Log the fetched data
        setBook(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [bookId]);

  const addToCart = (book) => {
    const existingItem = cart.find((item) => item.id === book.id);

    if (existingItem) {
      const updatedCart = cart.map((item) => {
        if (item.id === book.id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });

      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, { ...book, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    showNotificationMessage(`${book.title} has been added to your cart.`);
    setShowNotification(true);
  };

  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="container">
      <nav className="nav">
        <div className="book">BOOKHIVE</div>
        <Link to="/home" className="nav-link">
          Home
        </Link>
        <Link to="/cart" className="cart">
          Cart
        </Link>
      </nav>
      <div className="book-details-content">
        {book ? (
          <div className="book-details">
            <img src={book.image} alt={book.title} />
            <h1>{book.title}</h1>
            <p>Author: {book.author}</p>
            <p>Price: ${book.price}</p>
            <p>Description: {book.description}</p>
            <button className="add-to-cart-button" onClick={() => addToCart(book)}>
              Add to Cart
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        
      </div>
      <div className="info" >
        <div className="foot">
          <ul className="footer">
            <li>
              <b>Mail us:</b>
            </li>
            <li>example@email.com</li>
          </ul>
          <ul className="footer">
            <li>
              <b>Careers:</b>
            </li>
            <li>Information about careers.</li>
          </ul>
          <ul className="footer">
            <li>
              <b>Policy:</b>
            </li>
            <li>Our policy is very heretically banal with profound but fastidious pointers. So do not be polemical about it.</li>
          </ul>
          <ul className="footer">
            <li>
              <b>Owners:</b>
            </li>
            <li>Alok</li>
            <li>Ahesh</li>
            <li>Aditi</li>
            <li>A prasad</li>
            <li>Aditya</li>
          </ul>
          <ul className="footer">
            <li>© 2023, bookhive.com, Inc. or its affiliates</li>
          </ul>
        </div>
        <div className="connect">connect with us on</div>
        <div className="iconAlign">
          <a href="https://www.instagram.com/your-instagram-profile">
            <img src="https://i.pinimg.com/originals/f2/73/ee/f273ee301463c4b4f90ba9609a4c9346.png" className="icon" alt="Instagram" />
          </a>
          <a href="https://twitter.com/your-twitter-profile">
            <img src="https://i.pinimg.com/originals/7d/44/d5/7d44d55ead7dda48bd95632d92fb259d.png" className="icon" alt="Twitter" />
          </a>
        </div>
      </div>
      {showNotification && (
        <div className="notification">
          {notificationMessage}
        </div>
      )}
   
    </div>
  );
}
export default BookDetails;
