import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    if (storedCart) {
      setCartItems(storedCart);
    }
  }, []);

  const total = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setShowNotification(true); // Show the notification
    setTimeout(() => {
      setShowNotification(false); // Hide the notification after a delay
    }, 3000); // Adjust the delay (in milliseconds) as needed
  };

  

  return (
    <div className="cart-container">
      <nav className="nav">
        <div className="book">BOOKHIVE</div>
        <Link to="/home" className="nav-link">
          Home
        </Link>
      </nav>

      <div className="cart-content">
        <h1>Your Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="cart-grid">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div>
                  <img src={item.image} alt={item.title} />
                  <h3>{item.title}</h3>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <button onClick={() => removeFromCart(item.id)} className="remove-button">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
{cartItems.length > 0 && (
        <div>
          <p>Total Price: ${total.toFixed(2)}</p>
          <Link to={`/payment/${total}`} className="checkout-button">
            Proceed to Checkout
          </Link>
        </div>
      )}
      </div>

      {showNotification && (
        <div className="notification">
          Item removed successfully from the cart.
        </div>
      )}

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
    </div>
  );
}

export default Cart;
