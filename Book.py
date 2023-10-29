import razorpay
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
import hashlib
import pymongo
import jwt
import datetime
from flask_cors import CORS
import re
import bcrypt
from bson import ObjectId

app = Flask(__name__)
CORS(app)  # Enable CORS app
api = Api(app)
app.config['SECRET_KEY'] = 'sdsjhbdhsdbshdbhdbhbhbdbhhbhbshh4u456535554u49fhff'  # Replace with a secret key
razorpay_client = razorpay.Client(auth=("dhbcdhbdhbwaslnxaslclsaiasnddsc", "djfbjdbfrnbjfrbiakjndajasindin55bjd"))

mongo_client = pymongo.MongoClient('mongodb://localhost:27017/')
db = mongo_client['bookhive']
users_collection = db['users']
admins_collection = db['admins']
books_collection = db['books']


@app.route('/charge', methods=['POST'])
def charge():
    try:
        amount = int(request.form['amount'])  # Get the payment amount from the request data

        response = razorpay_client.order.create({
            'amount': amount,
            'currency': 'INR',  # Change to your desired currency
            'payment_capture': 1,  # Auto-capture the payment
        })

        return jsonify({
            'orderId': response['id'],
            'amount': response['amount'],
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def is_valid_email(email):
    # regular expression pattern for a basic email format check
    email_pattern = r'^\S+@\S+\.\S+$'

    # re.match() function to check if the email matches the pattern
    return bool(re.match(email_pattern, email))


def is_valid_username(username):
    # Check if the username is between 4 and 20 characters
    if len(username) < 4 or len(username) > 20:
        return False

    # Check if the username contains only alphanumeric characters
    if not username.isalnum():
        return False

    return True


def is_valid_password(password):
    # Check if the password is at least 8 characters long
    if len(password) < 8:
        return False

    # Check if the password contains at least one uppercase letter
    if not any(char.isupper() for char in password):
        return False

    # Check if the password contains at least one lowercase letter
    if not any(char.islower() for char in password):
        return False

    # Check if the password contains at least one digit
    if not any(char.isdigit() for char in password):
        return False

    # Check if the password contains at least one special character
    special_characters = "!@#$%^&*()_+-=[]{}|;:'\",.<>?/~"
    if not any(char in special_characters for char in password):
        return False

    return True

class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']

        # Validate email format
        if not is_valid_email(email):
            return {'message': 'Invalid email format'}, 400

        if not is_valid_username(username):
            return {'message': 'Invalid username format'}, 400

        if not is_valid_password(password):
            return {'message': 'Password does not meet requirements'}, 400

        existing_user = users_collection.find_one({'username': username})
        existing_admin = admins_collection.find_one({'username': username})

        if existing_user or existing_admin:
            return {'message': 'Username already exists'}, 400

        # Securely hash the password using bcrypt
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Perform user registration in the users collection
        users_collection.insert_one({'username': username, 'email': email, 'password': password_hash, 'role': 'User'})

        return {'message': 'User registered successfully'}, 201

class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        username_or_email = data.get('username_or_email')
        password = data['password']

        # First, check if the input is an email or username
        user = users_collection.find_one(
            {'$or': [{'username': username_or_email}, {'email': username_or_email}]})

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
            # Generate a token
            token = jwt.encode({'username': user['username'], 'role': user['role'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, app.config['SECRET_KEY'])
            return {'token': token}

        return {'message': 'Invalid user credentials'}, 401


class AdminRegistration(Resource):
    def post(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']

        # Validate email format
        if not is_valid_email(email):
            return {'message': 'Invalid email format'}, 400

        if not is_valid_username(username):
            return {'message': 'Invalid username format'}, 400

        if not is_valid_password(password):
            return {'message': 'Password does not meet requirements'}, 400

        existing_admin = admins_collection.find_one({'username': username})
        existing_user = users_collection.find_one({'username': username})

        if existing_admin or existing_user:
            return {'message': 'Username already exists'}, 400

        # Securely hash the password using bcrypt
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Perform admin registration in the admins collection
        admins_collection.insert_one({'username': username, 'email': email, 'password': password_hash, 'role': 'Admin'})

        return {'message': 'Admin registered successfully'}, 201


class AdminLogin(Resource):
    def post(self):
        data = request.get_json()
        username_or_email = data.get('username_or_email')
        password = data['password']

        # First, check if the input is an email or username
        admin = admins_collection.find_one(
            {'$or': [{'username': username_or_email}, {'email': username_or_email}]})

        if admin and bcrypt.checkpw(password.encode('utf-8'), admin['password']):
            # Generate a token
            token = jwt.encode({'username': admin['username'], 'role': admin['role'],
                                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
                               app.config['SECRET_KEY'])

            # Debugging: Print the token
            print(f"Generated token: {token}")

            return {'token': token}

        return {'message': 'Invalid admin credentials'}, 401




class BookResource(Resource):
    def get(self, book_id):
        # Attempt to parse the book_identifier as an integer (id)
        try:
            book_idd = int(book_id)
            book = books_collection.find_one({'id': book_id})
        except ValueError:

            # If parsing as an integer fails, assume book_identifier is an _id
            book = books_collection.find_one({'_id': ObjectId(book_id)})

        if book:
            # Serialize and return the book
            serialized_book = self.serialize_book(book)
            return serialized_book, 200
        else:
            return {'message': 'Book not found'}, 404

    def post(self):
        data = request.get_json()

        # Validate the data
        required_fields = ['id', 'title', 'price', 'description', 'author', 'category', 'image']
        if not all(field in data for field in required_fields):
            return {'message': 'ID, title, price, description, author, category, and image are required fields'}, 400

        # Insert the book into the collection
        new_book = {
            "id": data['id'],
            "title": data['title'],
            "description": data['description'],
            "category": data['category'],
            "author": data['author'],
            "image": data['image'],
            "price": data['price']
        }
        result = books_collection.insert_one(new_book)

        # Return the inserted book with its generated ID
        return {'message': 'Book created successfully', 'id': new_book['id']}, 201

    def put(self, book_id):
        data = request.get_json()

        # Validate the data
        if 'id' not in data or 'title' not in data or 'price' not in data or 'description' not in data or 'author' not in data or 'category' not in data:
            return {'message': 'id, title, price, description, author, and category are required fields'}, 400

        # Convert the book_id to ObjectId
        try:
            book_id = ObjectId(book_id)
        except Exception as e:
            return {'message': 'Invalid book_id format'}, 400

        # Update the book in the collection using the _id field
        result = books_collection.update_one(
            {'_id': book_id},  # Use _id field
            {'$set': {
                "id": data['id'],  # Make sure to update the 'id' field
                "title": data['title'],
                "description": data['description'],
                "category": data['category'],
                "author": data['author'],
                "image": data.get('image', ''),
                "price": data['price']
            }}
        )

        if result.modified_count == 0:
            return {'message': 'Book not found'}, 404

        return {'message': 'Book updated successfully'}, 200

    def delete(self, book_id):
        # Check if the provided book_id is a valid ObjectId
        if ObjectId.is_valid(book_id):
            # Try to delete the book using _id first
            result = books_collection.delete_one({'_id': ObjectId(book_id)})
            if result.deleted_count > 0:
                return {'message': 'Book deleted successfully'}, 200

        # If it's not a valid ObjectId or the deletion using _id didn't succeed,
        # try deleting using the 'id' field
        result = books_collection.delete_one({'id': book_id})

        if result.deleted_count == 0:
            return {'message': 'Book not found'}, 404

        return {'message': 'Book deleted successfully'}, 200

    def serialize_book(self, book):
        # Convert ObjectId to string for serialization
        book['_id'] = str(book['_id'])
        return book

class BookSearch(Resource):
    def post(self):
        data = request.get_json()
        if 'query' not in data:
            return {'message': 'Search query is required'}, 400

        search_query = data['query']

        # Search the books collection for books matching the query
        search_result = list(books_collection.find({
            '$or': [
                {'title': {'$regex': search_query, '$options': 'i'}},  # Case-insensitive title search
                {'author': {'$regex': search_query, '$options': 'i'}},  # Case-insensitive author search
                {'category': {'$regex': search_query, '$options': 'i'}}  # Case-insensitive category search
            ]
        }))

        # Convert ObjectId to string for serialization
        search_result = [self.serialize_book(book) for book in search_result]

        return search_result, 200

    def serialize_book(self, book):
        # Convert ObjectId to string for serialization
        book['_id'] = str(book['_id'])
        return book

class BookCategories(Resource):
    def get(self, category_name=None):
        if category_name == 'all':
            all_books = list(books_collection.find({}))
            all_books = [self.serialize_book(book) for book in all_books]
            return all_books, 200

        if not category_name:
            categories = list(books_collection.distinct('category'))
            return categories, 200

        # Normalize the category name to be URL-safe (replace spaces with underscores)
        normalized_category = category_name.replace(' ', '_')
        books = list(books_collection.find({'category': normalized_category}))
        books = [self.serialize_book(book) for book in books]
        return books, 200


    def serialize_book(self, book):
        # Convert ObjectId to string for serialization
        book['_id'] = str(book['_id'])
        return book

# API endpoints for both user and admin
api.add_resource(BookResource, '/books', '/books/<string:book_id>')
api.add_resource(BookSearch, '/books/search')
api.add_resource(BookCategories, '/books/category/<string:category_name>')
api.add_resource(UserRegistration, '/register/user')
api.add_resource(UserLogin, '/login/user')
api.add_resource(AdminRegistration, '/register/admin')
api.add_resource(AdminLogin, '/login/admin')


if __name__ == '__main__':
    app.run(debug=True)
