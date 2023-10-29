import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [showCarousel, setShowCarousel] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const footerRef = useRef(null);
  const selectCategoryRef = useRef(null);

  const navigationLinks = [
    { text: 'Home', link: '#' },
    { text: 'Book categories', link: 'selectCategory' },
    { text: 'Contact Us', link: 'footer' },
  ];

  useEffect(() => {
    fetchBooks(selectedCategory);
  }, [selectedCategory]);

  function topFunction() {
    window.scrollTo(0, 0);
  }

  function handleLogout() {
    localStorage.clear();
    window.location.reload();
  }

  const filterBooks = (query) => {
    axios
      .post('http://127.0.0.1:5000/books/search', { query: query })
      .then((response) => {
        setBooks(response.data);
        setShowCarousel(query === '');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterBooks(query);
  };

  const scrollToFooter = () => {
    footerRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Science Fiction',
    'Health and fitness',
    'Romance',
    'Children',
  ];

  const fetchBooks = (category) => {
    if (category === 'all') {
      axios
        .get('http://127.0.0.1:5000/books/category/all')
        .then((response) => {
          setBooks(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      const categoryLowercase = category.toLowerCase();
      axios
        .get(`http://127.0.0.1:5000/books/category/${categoryLowercase}`)
        .then((response) => {
          setBooks(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

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
        <form action="https://www.google.com/search" method="GET">
          <input
            type="text"
            name="q"
            placeholder="search"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </form>
        <Link to="/cart" className="cart">
          Cart
        </Link>
      </nav>
      <div className="nav2">
        {navigationLinks.map((link, index) => (
          <div className="navContent" key={index}>
            {link.link === 'selectCategory' ? (
              <a
                href="#selectCategory"
                onClick={() => selectCategoryRef.current.scrollIntoView({ behavior: 'smooth' })}
                className="nav_a"
              >
                {link.text}
              </a>
            ) : (
              <Link
                to={link.link === 'footer' ? '#' : link.link}
                onClick={link.link === 'footer' ? scrollToFooter : null}
                className="nav_a"
              >
                {link.text}
              </Link>
            )}
          </div>
        ))}
        <div className="navContent">
          {localStorage.getItem('token') ? (
            <button onClick={handleLogout} className="nav_button">
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav_a">
              Login/Signup
            </Link>
          )}
        </div>
      </div>

      {showCarousel && (
        <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} autoPlay={true}>
          <div>
            <img src="https://storage.googleapis.com/zopping-uploads/images%2F1024%2F20230616%2F16687231981668723198goodreadsmisc-20230616-071853.png" alt="First slide" />
          </div>
          <div>
            <img src="https://storage.googleapis.com/zopping-uploads/1024/20220516/aa-20220516-155336.jpeg" alt="Second slide" />
          </div>
          <div>
            <img src="https://storage.googleapis.com/zopping-uploads/1024/20220516/002213281366x154-20220516-124746.jpeg" alt="Third slide" />
          </div>
        </Carousel>
      )}

      {showNotification && (
        <div className="notification">
          <p>{notificationMessage}</p>
          <button onClick={() => setShowNotification(false)}>Close</button>
        </div>
      )}

      <div>
        <h1></h1>
      </div>
      <div ref={selectCategoryRef} className="categories-dropdown" id="selectCategory">
        <label htmlFor="category">Select Category:</label>
        <select id="category" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
          <option value="all">All</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h1></h1>
      </div>

      {books.length > 0 && (
        <div className="book-grid">
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <img src={book.image} alt={book.title} />
              <Link to={`/book/${book.id}`}>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </Link>
              <p>Price: ${book.price}</p>
              <button
                onClick={() => addToCart(book)}
                className="add-to-cart-button"
                style={{
                  backgroundColor: '#007bff',
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  transition: 'background-color 0.2s, transform 0.1s',
                }}
              >
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <h1></h1>
      </div>
      <div className="info">
        <h1>Click on the book for more info</h1>
      </div>
      <div className="topButton">
        <button className="top" onClick={topFunction}>
          Back to top
        </button>
      </div>
      <div className="info" ref={footerRef}>
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

export default Home;
