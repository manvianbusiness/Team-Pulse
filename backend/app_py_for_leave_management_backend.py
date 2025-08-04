# app.py

print("----- Flask Application is starting from THIS file! -----")

from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date
from functools import wraps  # For custom decorators
import os

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Rejoy@2005',
    'database': 'leave_management_db'
}

# Function to get a new database connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host='localhost',
            user='root',
            password='Rejoy@2005',
            database='leave_management_db'
        )
        print("✅ Connected to database.")
        return conn
    except mysql.connector.Error as err:
        print(f"❌ Database connection error: {err}")
        return None

# Create a Flask application instance
app = Flask(__name__)
CORS(app) 

# --- CUSTOM, TEMPORARY INSECURE DECORATORS ---
# These decorators are a temporary measure to bypass a broken JWT implementation.
# They check for custom headers instead of a token to authenticate users and admins.
def custom_admin_required():
    """
    A temporary decorator that checks for an 'X-User-Role: admin' header.
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            if request.headers.get('X-User-Role') == 'admin':
                return fn(*args, **kwargs)
            else:
                return jsonify({"message": "Admin access required"}), 403
        return decorator
    return wrapper

def custom_user_required():
    """
    A temporary decorator that checks for an 'X-User-ID' header.
    """
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            user_id = request.headers.get('X-User-ID')
            if user_id:
                # Store the user_id in the request global for later use
                request.current_user_id = int(user_id)
                return fn(*args, **kwargs)
            else:
                return jsonify({"message": "Authentication required"}), 401
        return decorator
    return wrapper
# --- END TEMPORARY DECORATORS ---


# --- Basic Health Check Endpoints ---

@app.route('/')
def hello_world():
    """A simple home route to confirm the server is running."""
    return 'Hello, World! Welcome to Leave Management Backend!'

@app.route('/test_db_connection')
def test_db_connection():
    """
    A test route to check if the database connection is working.
    """
    conn = None
    try:
        conn = get_db_connection()
        if conn and conn.is_connected():
            return jsonify({"message": "Database connection successful!", "status": "connected"})
        else:
            return jsonify({"message": "Database connection failed.", "status": "failed"}), 500
    except Exception as e:
        return jsonify({"message": f"An error occurred: {str(e)}", "status": "error"}), 500
    finally:
        if conn and conn.is_connected():
            conn.close()


# --- User Authentication Endpoints ---

@app.route('/register', methods=['POST'])
def register_user():
    """
    Registers a new user in the database.
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    role = data.get('role', 'employee') # Default role is 'employee'

    if not username or not password or not email:
        return jsonify({"message": "Username, password, and email are required."}), 400

    hashed_password = generate_password_hash(password)

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor()
        query = """
        INSERT INTO users (username, password_hash, email, first_name, last_name, role)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (username, hashed_password, email, first_name, last_name, role))
        conn.commit()
        return jsonify({"message": "User registered successfully!", "user_id": cursor.lastrowid}), 201
    except mysql.connector.Error as err:
        if err.errno == 1062: # Duplicate entry error
            return jsonify({"message": "Username or email already exists."}), 409
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route('/login', methods=['POST'])
def login_user():
    """
    Authenticates a user and returns their user_id and role.
    """
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required."}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor(dictionary=True) # dictionary=True makes rows returned as dicts
        query = "SELECT id, username, password_hash, role FROM users WHERE username = %s"
        cursor.execute(query, (username,))
        user = cursor.fetchone()

        if user and check_password_hash(user['password_hash'], password):
            # TEMPORARY: For demonstration, we just return the user ID and role
            return jsonify(user_id=user['id'], role=user['role']), 200
        else:
            return jsonify({"message": "Invalid username or password."}), 401
    except Exception as e:
        print(f"ERROR: login_user - An unexpected error occurred: {str(e)}")
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

# --- PROTECTED ROUTE (NOW USES TEMPORARY DECORATOR) ---
@app.route('/protected', methods=['GET'])
@custom_user_required()
def protected():
    """
    A sample protected route to test the custom decorator.
    """
    user_id = request.headers.get('X-User-ID')
    return jsonify(logged_in_as={'id': user_id, 'message': 'You have accessed a protected route with a custom header'}), 200
# --- END PROTECTED ROUTE ---


# --- Leave Type Management Endpoints (Admin Only) ---

@app.route('/leave_types', methods=['POST'])
@custom_admin_required()
def add_leave_type():
    """Adds a new leave type."""
    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    max_days_per_year = data.get('max_days_per_year')

    if not name or max_days_per_year is None:
        return jsonify({"message": "Leave type name and max_days_per_year are required."}), 400
    if not isinstance(max_days_per_year, int) or max_days_per_year < 0:
        return jsonify({"message": "max_days_per_year must be a non-negative integer."}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor()
        query = "INSERT INTO leave_types (name, description, max_days_per_year) VALUES (%s, %s, %s)"
        cursor.execute(query, (name, description, max_days_per_year))
        conn.commit()
        return jsonify({"message": "Leave type added successfully!", "id": cursor.lastrowid}), 201
    except mysql.connector.Error as err:
        if err.errno == 1062: # Duplicate entry error
            return jsonify({"message": "Leave type name already exists."}), 409
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route('/leave_types', methods=['GET'])
def get_all_leave_types():
    """Retrieves all available leave types."""
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor(dictionary=True)
        query = "SELECT id, name, description, max_days_per_year FROM leave_types ORDER BY name"
        cursor.execute(query)
        leave_types = cursor.fetchall()

        return jsonify(leave_types), 200
    except Exception as e:
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

# --- Leave Request and Balance Endpoints (Employee Functionality) ---

@app.route('/leave_requests', methods=['POST'])
@custom_user_required()
def apply_for_leave():
    """
    Submits a new leave request for the authenticated user.
    """
    user_id = request.current_user_id
    data = request.get_json()
    leave_type_id = data.get('leave_type_id')
    start_date_str = data.get('start_date')
    end_date_str = data.get('end_date')
    reason = data.get('reason')
    num_days = data.get('num_days')

    if not all([leave_type_id, start_date_str, end_date_str, reason, num_days]):
        return jsonify({"message": "Missing required fields for leave request."}), 400

    try:
        start_date = date.fromisoformat(start_date_str)
        end_date = date.fromisoformat(end_date_str)
        if start_date > end_date:
            return jsonify({"message": "Start date cannot be after end date."}), 400
    except ValueError:
        return jsonify({"message": "Invalid date format. Use YYYY-MM-DD."}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor()
        cursor.execute("SELECT id FROM leave_types WHERE id = %s", (leave_type_id,))
        if not cursor.fetchone():
            return jsonify({"message": "Leave type not found."}), 404

        query = """
        INSERT INTO leave_requests (user_id, leave_type_id, start_date, end_date, num_days, reason, status)
        VALUES (%s, %s, %s, %s, %s, %s, 'pending')
        """
        cursor.execute(query, (user_id, leave_type_id, start_date, end_date, num_days, reason))
        conn.commit()
        return jsonify({"message": "Leave request submitted successfully!", "request_id": cursor.lastrowid}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route('/users/<int:user_id>/leave_balances', methods=['GET'])
@custom_user_required()
def get_user_leave_balances(user_id):
    """
    Retrieves the leave balances for a specific user.
    Requires the user to be the owner of the ID or an admin.
    """
    current_user_id = request.current_user_id
    if current_user_id != user_id and request.headers.get('X-User-Role') != 'admin':
        return jsonify({"message": "Unauthorized to view these balances."}), 403

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT lt.name AS leave_type_name, lb.balance, lb.year
        FROM leave_balances lb
        JOIN leave_types lt ON lb.leave_type_id = lt.id
        WHERE lb.user_id = %s
        ORDER BY lt.name
        """
        cursor.execute(query, (user_id,))
        balances = cursor.fetchall()

        if not balances:
            return jsonify({"message": "No leave balances found for this user."}), 404

        return jsonify(balances), 200
    except Exception as e:
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route('/users/<int:user_id>/leave_requests', methods=['GET'])
@custom_user_required()
def get_user_leave_requests(user_id):
    """
    Retrieves all leave requests for a specific user.
    Requires the user to be the owner of the ID or an admin.
    """
    current_user_id = request.current_user_id
    if current_user_id != user_id and request.headers.get('X-User-Role') != 'admin':
        return jsonify({"message": "Unauthorized to view these requests."}), 403

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT
            lr.id AS request_id,
            lt.name AS leave_type_name,
            lr.start_date,
            lr.end_date,
            lr.num_days,
            lr.reason,
            lr.status,
            lr.applied_date,
            u_approver.username AS approved_by_username,
            lr.approval_date
        FROM leave_requests lr
        JOIN users u ON lr.user_id = u.id
        JOIN leave_types lt ON lr.leave_type_id = lt.id
        LEFT JOIN users u_approver ON lr.approved_by = u_approver.id
        WHERE lr.user_id = %s
        ORDER BY lr.applied_date DESC
        """
        cursor.execute(query, (user_id,))
        requests = cursor.fetchall()

        if not requests:
            return jsonify({"message": "No leave requests found for this user."}), 404
        return jsonify(requests), 200
    except Exception as e:
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

# --- Admin Leave Request Management Endpoints ---

@app.route('/admin/leave_requests', methods=['GET'])
@custom_admin_required()
def get_all_pending_leave_requests():
    """
    Retrieves all pending leave requests for review by an admin.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor(dictionary=True)
        query = """
        SELECT
            lr.id AS request_id,
            u.username AS employee_username,
            lt.name AS leave_type_name,
            lr.start_date,
            lr.end_date,
            lr.num_days,
            lr.reason,
            lr.status,
            lr.applied_date
        FROM leave_requests lr
        JOIN users u ON lr.user_id = u.id
        JOIN leave_types lt ON lr.leave_type_id = lt.id
        WHERE lr.status = 'pending'
        ORDER BY lr.applied_date ASC
        """
        cursor.execute(query)
        pending_requests = cursor.fetchall()

        if not pending_requests:
            return jsonify({"message": "No pending leave requests found."}), 404

        return jsonify(pending_requests), 200
    except Exception as e:
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route('/admin/leave_requests/<int:request_id>/approve', methods=['PUT'])
@custom_admin_required()
def approve_leave_request(request_id):
    """
    Approves a pending leave request and updates the user's leave balance.
    """
    admin_id = request.headers.get('X-User-ID') # Get admin_id from header
    if not admin_id:
        return jsonify({"message": "Admin ID header is missing."}), 401

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor(dictionary=True)
        conn.start_transaction()

        cursor.execute("""
            SELECT user_id, leave_type_id, num_days, status
            FROM leave_requests WHERE id = %s FOR UPDATE
        """, (request_id,))
        request_details = cursor.fetchone()

        if not request_details:
            conn.rollback()
            return jsonify({"message": "Leave request not found."}), 404
        if request_details['status'] != 'pending':
            conn.rollback()
            return jsonify({"message": f"Leave request is already {request_details['status']}."}), 400

        user_id = request_details['user_id']
        leave_type_id = request_details['leave_type_id']
        num_days = request_details['num_days']

        cursor.execute("""
            SELECT balance FROM leave_balances
            WHERE user_id = %s AND leave_type_id = %s AND year = YEAR(CURDATE()) FOR UPDATE
        """, (user_id, leave_type_id))
        balance_row = cursor.fetchone()

        if not balance_row or balance_row['balance'] < num_days:
            conn.rollback()
            return jsonify({"message": "Insufficient leave balance or no balance entry found for this leave type."}), 400

        new_balance = balance_row['balance'] - num_days
        cursor.execute("""
            UPDATE leave_balances SET balance = %s
            WHERE user_id = %s AND leave_type_id = %s AND year = YEAR(CURDATE())
        """, (new_balance, user_id, leave_type_id))

        cursor.execute("""
            UPDATE leave_requests SET status = 'approved', approved_by = %s, approval_date = NOW()
            WHERE id = %s
        """, (admin_id, request_id))

        conn.commit()
        return jsonify({"message": "Leave request approved and balance updated successfully!"}), 200

    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({"message": f"Database error during approval: {err}"}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route('/admin/leave_requests/<int:request_id>/decline', methods=['PUT'])
@custom_admin_required()
def decline_leave_request(request_id):
    """
    Declines a pending leave request.
    """
    admin_id = request.headers.get('X-User-ID') # Get admin_id from header
    if not admin_id:
        return jsonify({"message": "Admin ID header is missing."}), 401

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor(dictionary=True)
        conn.start_transaction()
        
        cursor.execute("SELECT status FROM leave_requests WHERE id = %s", (request_id,))
        request_details = cursor.fetchone()

        if not request_details:
            conn.rollback()
            return jsonify({"message": "Leave request not found."}), 404
        if request_details['status'] != 'pending':
            conn.rollback()
            return jsonify({"message": f"Leave request is already {request_details['status']}."}), 400

        cursor.execute("""
            UPDATE leave_requests SET status = 'declined', approved_by = %s, approval_date = NOW()
            WHERE id = %s
        """, (admin_id, request_id))

        conn.commit()
        return jsonify({"message": "Leave request declined successfully!"}), 200
    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({"message": f"Database error during decline: {err}"}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

# --- Admin User Management Endpoints ---

@app.route('/admin/users', methods=['GET'])
@custom_admin_required()
def get_all_users():
    """Retrieves a list of all users."""
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor(dictionary=True)
        query = "SELECT id, username, email, first_name, last_name, role, created_at FROM users ORDER BY username"
        cursor.execute(query)
        users = cursor.fetchall()

        return jsonify(users), 200
    except Exception as e:
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route('/admin/users', methods=['POST'])
@custom_admin_required()
def admin_create_user():
    """Allows an admin to create a new user."""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    role = data.get('role', 'employee')

    if not username or not password or not email:
        return jsonify({"message": "Username, password, and email are required."}), 400
    if role not in ['employee', 'admin']:
        return jsonify({"message": "Invalid role. Must be 'employee' or 'admin'."}), 400

    hashed_password = generate_password_hash(password)

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor()
        query = """
        INSERT INTO users (username, password_hash, email, first_name, last_name, role)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (username, hashed_password, email, first_name, last_name, role))
        conn.commit()
        return jsonify({"message": "User created successfully!", "user_id": cursor.lastrowid}), 201
    except mysql.connector.Error as err:
        if err.errno == 1062:
            return jsonify({"message": "Username or email already exists."}), 409
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route('/admin/users/<int:user_id>', methods=['PUT'])
@custom_admin_required()
def admin_update_user(user_id):
    """Allows an admin to update a user's details."""
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    role = data.get('role')
    password = data.get('password')

    updates = []
    params = []

    if username:
        updates.append("username = %s")
        params.append(username)
    if email:
        updates.append("email = %s")
        params.append(email)
    if first_name:
        updates.append("first_name = %s")
        params.append(first_name)
    if last_name:
        updates.append("last_name = %s")
        params.append(last_name)
    if role:
        if role not in ['employee', 'admin']:
            return jsonify({"message": "Invalid role. Must be 'employee' or 'admin'."}), 400
        updates.append("role = %s")
        params.append(role)
    if password:
        hashed_password = generate_password_hash(password)
        updates.append("password_hash = %s")
        params.append(hashed_password)

    if not updates:
        return jsonify({"message": "No fields provided for update."}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor()
        query = f"UPDATE users SET {', '.join(updates)} WHERE id = %s"
        params.append(user_id)

        cursor.execute(query, tuple(params))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "User not found or no changes made."}), 404
        return jsonify({"message": "User updated successfully!"}), 200
    except mysql.connector.Error as err:
        if err.errno == 1062:
            return jsonify({"message": "Username or email already exists."}), 409
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()


@app.route('/admin/users/<int:user_id>', methods=['DELETE'])
@custom_admin_required()
def admin_delete_user(user_id):
    """Allows an admin to delete a user and their associated data."""
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor()
        conn.start_transaction()
        
        cursor.execute("DELETE FROM leave_requests WHERE user_id = %s", (user_id,))
        cursor.execute("DELETE FROM leave_balances WHERE user_id = %s", (user_id,))
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"message": "User not found or already deleted."}), 404
        return jsonify({"message": "User and all associated data deleted successfully!"}), 200
    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({"message": f"Database error during deletion: {err}"}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

# --- Admin Endpoint to Initialize/Update User Leave Balances ---
@app.route('/admin/users/<int:user_id>/leave_balances', methods=['POST', 'PUT'])
@custom_admin_required()
def admin_set_user_leave_balance(user_id):
    """
    Sets or updates a specific leave balance for a user.
    """
    data = request.get_json()
    leave_type_id = data.get('leave_type_id')
    balance = data.get('balance')
    year = data.get('year')

    if not all([leave_type_id, balance, year is not None]):
        return jsonify({"message": "Missing leave_type_id, balance, or year."}), 400
    if not isinstance(balance, (int, float)) or balance < 0:
        return jsonify({"message": "Balance must be a non-negative number."}), 400
    if not isinstance(year, int) or year < 2000 or year > 2100:
        return jsonify({"message": "Invalid year."}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Database connection error."}), 500

        cursor = conn.cursor()

        cursor.execute("SELECT id FROM users WHERE id = %s", (user_id,))
        if not cursor.fetchone():
            return jsonify({"message": "User not found."}), 404
        cursor.execute("SELECT id FROM leave_types WHERE id = %s", (leave_type_id,))
        if not cursor.fetchone():
            return jsonify({"message": "Leave type not found."}), 404

        cursor.execute(
            "SELECT id FROM leave_balances WHERE user_id = %s AND leave_type_id = %s AND year = %s",
            (user_id, leave_type_id, year)
        )
        existing_balance = cursor.fetchone()

        if existing_balance:
            query = """
            UPDATE leave_balances SET balance = %s
            WHERE user_id = %s AND leave_type_id = %s AND year = %s
            """
            cursor.execute(query, (balance, user_id, leave_type_id, year))
            message = "Leave balance updated successfully!"
        else:
            query = """
            INSERT INTO leave_balances (user_id, leave_type_id, balance, year)
            VALUES (%s, %s, %s, %s)
            """
            cursor.execute(query, (user_id, leave_type_id, balance, year))
            message = "Leave balance initialized successfully!"

        conn.commit()
        return jsonify({"message": message}), 200
    except mysql.connector.Error as err:
        conn.rollback()
        return jsonify({"message": f"Database error: {err}"}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({"message": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)