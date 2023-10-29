import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Admin.css';

function Admin() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    id: '',
    title: '',
    price: '',
    description: '',
    author: '',
    category: '',
    image: '',
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isBookAdded, setIsBookAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingBookId, setEditingBookId] = useState(null);
  const [editedBook, setEditedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('books');

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'Admin') {
      setIsAdmin(true);
    }
    loadBooks(); // Load books initially
  }, []);

  const loadBooks = () => {
    axios.get('http://127.0.0.1:5000/books/category/all')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setNewBook(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const toggleAddBookForm = () => {
    setActiveTab('create');
  };

  const handleAddBook = () => {
    const { id, title, price, description, author, category, image } = newBook;

    if (!id || !title || !price || !description || !author || !category || !image) {
      setErrorMessage('All fields are required');
      return;
    }

    const bookData = {
      id,
      title,
      price,
      description,
      author,
      category,
      image,
    };

    axios.post('http://127.0.0.1:5000/books', bookData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        setBooks([...books, response.data]);
        setNewBook({
          id: '',
          title: '',
          price: '',
          description: '',
          author: '',
          category: '',
          image: '',
        });
        setErrorMessage('');
        setIsAddingBook(false);
        setIsBookAdded(true);
        setActiveTab('books');
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleAddMore = () => {
    setIsBookAdded(false);
    setErrorMessage('');
  };

  const handleEditBook = (bookId) => {
    const bookToEdit = books.find((book) => book._id === bookId || book.id === bookId);
    if (!bookToEdit) {
      return;
    }
  
    setEditingBookId(bookToEdit._id); // Use _id for editing
    setEditedBook({
      id: bookToEdit.id, // Display the simple id
      title: bookToEdit.title,
      price: bookToEdit.price,
      description: bookToEdit.description,
      author: bookToEdit.author,
      category: bookToEdit.category,
      image: bookToEdit.image,
    });
  
    setActiveTab('edit');
  };
  
  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
  
    setEditedBook((prevEditedBook) => ({
      ...prevEditedBook,
      [name]: value,
    }));
  };
  
  const handleUpdateBook = () => {
    if (!editingBookId || !editedBook) {
      return;
    }
  
    axios.put(`http://127.0.0.1:5000/books/${editingBookId}`, {
      _id: editingBookId, // Use _id for updating
      ...editedBook
    })
      .then(response => {
        const updatedBooks = books.map(book => {
          if (book._id === editingBookId || book.id === editingBookId) {
            return response.data;
          }
          return book;
        });
        setBooks(updatedBooks);
        setEditingBookId(null);
        setEditedBook(null);
      })
      .catch(error => {
        console.error(error);
      });
  };  

  const handleDeleteBook = (bookId) => {
    if (/^[0-9a-fA-F]{24}$/.test(bookId)) {
      axios.delete(`http://127.0.0.1:5000/books/${bookId}`)
        .then(response => {
          const updatedBooks = books.filter(book => book._id !== bookId);
          setBooks(updatedBooks);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      axios.delete(`http://127.0.0.1:5000/books/${bookId}`)
        .then(response => {
          const updatedBooks = books.filter(book => book.id !== bookId);
          setBooks(updatedBooks);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const filterBooks = (query) => {
    axios.post('http://127.0.0.1:5000/books/search', { query: query })
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const handleSearch = () => {
    // No need for an API call here, as filtering is done in real-time
  };

  const handleSearchInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    
    filterBooks(query);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="Admin">
      <div className="admin-header">
        <h1>Admin</h1>
        <nav>
          <ul>
            <li className="nav-item">
              <input
                type="text"
                placeholder="Search Books"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              <button className="search-button" onClick={handleSearch}>
                Search
              </button>
            </li>
          </ul>
        </nav>
      </div>
      <div className="sidebar">
        <h2>Admin</h2>
        <ul>
          <li
            className={`sidebar-item ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            Your Books
          </li>
          {isAdmin && (
            <li
              className={`sidebar-item ${activeTab === 'create' ? 'active' : ''}`}
              onClick={toggleAddBookForm}
            >
              Create
            </li>
          )}
        </ul>
        <ul className="bottom-menu">
          <li className="sidebar-item" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>
      <div className="main-content">
        {activeTab === 'books' && (
          <>
            <h2>Your Books</h2>
            <div className="book-grid">
              {books.map(book => (
                <div key={book._id} className="book-item">
                  <img
                    src={book.image}
                    alt={book.title}
                  />
                  <h3>{book.title}</h3>
                  <p>{book.author}</p>
                  <p>${book.price}</p>
                  {isAdmin && (
                    <div>
                      <button onClick={() => handleEditBook(book._id)}>Edit</button>
                      <button onClick={() => handleDeleteBook(book._id)}>Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {activeTab === 'create' && (
          <div className="create-book-form">
            <h2>Add a New Book</h2>
            {isBookAdded ? (
              <div className="success-message">
                Book is added to your database. Want to add more?
                <button className="add-more-button" onClick={handleAddMore}>
                  Add More
                </button>
              </div>
            ) : (
              <div className="add-book-form">
                <input
                  type="text"
                  name="id"
                  placeholder="ID"
                  value={newBook.id}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={newBook.title}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="price"
                  placeholder="Price"
                  value={newBook.price}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={newBook.description}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="author"
                  placeholder="Author"
                  value={newBook.author}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={newBook.category}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={newBook.image}
                  onChange={handleInputChange}
                />
                <button className="add-button" onClick={handleAddBook}>
                  Add Book
                </button>
              </div>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        )}
        {activeTab === 'edit' && editedBook && (
          <div className="edit-book-form">
            <h2>Edit Book</h2>
            <form>
              <div className="form-group">
                <label>ID:</label>
                <input
                  type="text"
                  name="id"
                  value={editedBook.id}
                  onChange={handleEditInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={editedBook.title}
                  onChange={handleEditInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="text"
                  name="price"
                  value={editedBook.price}
                  onChange={handleEditInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={editedBook.description}
                  onChange={handleEditInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Author:</label>
                <input
                  type="text"
                  name="author"
                  value={editedBook.author}
                  onChange={handleEditInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input
                  type="text"
                  name="category"
                  value={editedBook.category}
                  onChange={handleEditInputChange} 
                />
              </div>
              <div className="form-group">
                <label>Image URL:</label>
                <input
                  type="text"
                  name="image"
                  value={editedBook.image}
                  onChange={handleEditInputChange} 
                />
              </div>
              <div className="form-actions">
                <button className="update-button" onClick={handleUpdateBook}>
                  Update Book
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
