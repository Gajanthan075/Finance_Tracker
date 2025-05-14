from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from bson.json_util import dumps
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from datetime import datetime,timedelta
import calendar
from bson.objectid import ObjectId, InvalidId
import requests

app = Flask(__name__)
CORS(app)

# Configuration for MongoDB
app.config['MONGO_URI'] = "mongodb link"
mongo = PyMongo(app)

# Route to insert a new user
@app.route('/user', methods=['POST'])
def register_user():
    usertable = mongo.db.usertable
    userid = request.json.get('userid')
    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')

    # Check if all required fields are provided
    if not userid or not username or not password or not email:
        return jsonify({'error': 'Missing userid, username, password, or email'}), 400

    # Check if the userid already exists
    if usertable.find_one({'userid': userid}):
        return jsonify({'error': 'userid already exists'}), 400

    # Check if the email already exists
    if usertable.find_one({'email': email}):
        return jsonify({'error': 'email already exists'}), 400

    # Hash the password before storing
    hashed_password = generate_password_hash(password)

    # Insert a new user document
    user_id = usertable.insert_one({
        'userid': userid,
        'username': username,
        'password': hashed_password,
        'email': email
    }).inserted_id

    return jsonify({'message': f'user {username} added successfully!', 'userid':(userid)}), 201

@app.route('/auth', methods=['POST'])
def authenticate_user():
    usertable = mongo.db.usertable
    userid = request.json.get('userid')
    password = request.json.get('password')

    print("Received userid:", userid)
    print("Received password:", password)

    # Find the user by userid
    user = usertable.find_one({'userid': userid})

    if user:
        print("User found:", user)
    else:
        print("User not found")

    # Check if the user exists and the password is correct
    if user and check_password_hash(user['password'], password):
        print("Password verified successfully")
        return jsonify({'message': 'Login successful!', 'userid': userid}), 200
    else:
        print("Password verification failed")
        return jsonify({'message': 'Invalid userid or password!'}), 401
    
# Route to fetch all usernames
@app.route('/usernames', methods=['GET'])
def get_usernames():
    usertable = mongo.db.usertable
    users = usertable.find({}, {'_id': 0, 'username': 1})
    usernames = list(users)
    return dumps(usernames)

@app.route('/user/<userid>', methods=['GET'])
def get_user_by_id(userid):
    usertable = mongo.db.usertable
    user = usertable.find_one({'userid': userid}, {'_id': 0, 'username': 1, 'email': 1})
    
    if user:
        return jsonify(user)  # Return both username and email
    else:
        return jsonify({"error": "User not found"}), 404

#update user
@app.route('/user/<userid>', methods=['PUT'])
def update_user(userid):
    usertable = mongo.db.usertable
    data = request.json
    password = data.get('password')
    email = data.get('email')

    if password:
        data['password'] = generate_password_hash(password)

    updated_user = usertable.find_one_and_update(
        {'userid': userid},
        {'$set': data},
        return_document=True
    )

    if updated_user:
        return jsonify({'message': 'User updated successfully!'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

#delete user
@app.route('/user/<userid>', methods=['DELETE'])
def delete_user(userid):
    usertable = mongo.db.usertable
    result = usertable.delete_one({'userid': userid})

    if result.deleted_count:
        return jsonify({'message': 'User deleted successfully!'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
    


# Account route to create account 
@app.route('/account/<userid>', methods=['POST'])
def create_account(userid):
    account_collection = mongo.db.account_collection
    expense_record_collection = mongo.db.expense_record
    income_record_collection = mongo.db.income_record
    transaction_collection = mongo.db.transactions

    account_name = request.json.get('account_name')
    account_type = request.json.get('account_type')
    initial_amount = request.json.get('initial_amount')

    # Verify that the userid exists
    usertable = mongo.db.usertable
    user = usertable.find_one({'userid': str(userid)})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Calculate total income for this account
    income_records = income_record_collection.find({'userid': userid, 'account_type': account_type})
    total_income = sum(float(income['amount']) for income in income_records)

    # Calculate total expenses for this account
    expense_records = expense_record_collection.find({'userid': userid, 'account_type': account_type})
    total_expense = sum(float(expense['amount']) for expense in expense_records)

    # Calculate total transfers for this account
    transactions_from = transaction_collection.find({'userid': userid, 'transfer_from': account_name})
    transactions_to = transaction_collection.find({'userid': userid, 'transfer_to': account_name})

    total_transfer_from = sum(float(txn['amount']) for txn in transactions_from)
    total_transfer_to = sum(float(txn['amount']) for txn in transactions_to)

    # Calculate current balance
    current_balance = initial_amount + total_income + total_transfer_to - total_expense - sum(float(txn['amount']) for txn in transactions_from)


    # Insert a new account document
    account = {
        'userid': userid,
        'account_name': account_name,
        'account_type': account_type,
        'initial_amount': initial_amount,
        'total_income': total_income,
        'total_expense': total_expense,
        'total_transfer_from ': total_transfer_from,
        'total_transfer_to':total_transfer_to,
        'current_balance':current_balance,
        'created_at': datetime.now()
    }

    # Fetch and add additional details from expense_record, income_record, and transaction
    expense_records = list(expense_record_collection.find({'userid': userid, 'account_type': account_type}))
    income_records = list(income_record_collection.find({'userid': userid, 'account_type': account_type}))
    transactions_from = list(transaction_collection.find({'userid': userid, 'transfer_from': account_name}))
    transactions_to = list(transaction_collection.find({'userid': userid, 'transfer_to': account_name}))

    account['expense_records'] = expense_records
    account['income_records'] = income_records
    account['transactions_from'] = transactions_from
    account['transactions_to'] = transactions_to

    account_id = account_collection.insert_one(account).inserted_id
    

    return jsonify({'message': f'Account {account_name} added successfully!', 'account_id': str(account_id)}), 201

#fetch account
@app.route('/account/<userid>', methods=['GET'])
def get_account(userid):
    account_collection = mongo.db.account_collection
    user_account = account_collection.find({'userid': userid})
    return dumps(user_account)

#count acount
@app.route('/account/count/<userid>', methods=['GET'])
def get_account_count(userid):
    account_collection = mongo.db.account_collection
    
    # Count the number of accounts for the user
    account_count = account_collection.count_documents({'userid': userid})
    
    return jsonify({'account_count': account_count}), 200


@app.route('/account/total_balance/<userid>', methods=['GET'])
def get_total_balance(userid):
    account_collection = mongo.db.account_collection
    
    # Fetch all accounts for the user
    accounts = account_collection.find({'userid': userid})

    # Calculate the total balance
    total_balance = sum(account['current_balance'] for account in accounts)

    return jsonify({'total_balance': total_balance}), 200

# Update account
@app.route('/account/<userid>/<account_id>', methods=['PUT'])
def update_account(userid, account_id):
    account_collection = mongo.db.account_collection
    data = request.get_json()

    # Ensure account_id is a valid ObjectId
    try:
        account_obj_id = ObjectId(account_id)
    except InvalidId:
        return jsonify({'error': 'Invalid account ID format'}), 400

    updated_account = account_collection.find_one_and_update(
        {'userid': userid, '_id': account_obj_id},
        {'$set': data},
        return_document=True
    )

    if updated_account:
        return jsonify({'message': 'Account updated successfully!'}), 200
    else:
        return jsonify({'error': 'Account not found'}), 404

# Delete account
@app.route('/account/<account_id>', methods=['DELETE'])
def delete_account(account_id):
    account_collection = mongo.db.account_collection

    # Ensure account_id is a valid ObjectId
    try:
        account_obj_id = ObjectId(account_id)
    except InvalidId:
        return jsonify({'error': 'Invalid account ID format'}), 400

    result = account_collection.delete_one({'_id': account_obj_id})

    if result.deleted_count:
        return jsonify({'message': 'Account deleted successfully!'}), 200
    else:
        return jsonify({'error': 'Account not found'}), 404

#key api 0e260f5c15af6ef147be454c
# Function to get exchange rate
def get_exchange_rate(base_currency, target_currency):
    api_key = "0e260f5c15af6ef147be454c"  # Replace with your API key from the exchange rate provider
    url = f"https://v6.exchangerate-api.com/v6/{api_key}/latest/{base_currency}"
    
    try:
        response = requests.get(url)
        data = response.json()
        if data['result'] == 'success':
            return data['conversion_rates'].get(target_currency)
        else:
            return None
    except Exception as e:
        print(f"Error fetching exchange rate: {e}")
        return None

# Route for fetching combined cashflow with conversion
# Route for fetching combined cashflow with conversion
@app.route('/cashflow/<userid>/<currency>', methods=['GET'])
def get_combined_cash(userid, currency):
    try:
        account_collection = mongo.db.account_collection

        # Fetch all accounts for the user
        accounts = list(account_collection.find({'userid': userid}))
        if len(accounts) == 0:
            print(f"No accounts found for userid: {userid}")
            return jsonify({"error": "No accounts found"}), 404

        # Fetch the exchange rate
        base_currency = "USD"
        conversion_rate = get_exchange_rate(base_currency, currency)
        if conversion_rate is None or conversion_rate <= 0:
            print(f"Failed to fetch exchange rate for currency: {currency}")
            return jsonify({"error": "Failed to fetch exchange rate"}), 500

        # Prepare cashflow data (only account names and balances)
        combined_cashflow = {
            'labels': [],    # Account names
            'balances': []   # Converted balances
        }

        for account in accounts:
            account_name = account.get('account_name', 'Unknown Account')
            account_balance = account.get('current_balance', 0)  # Correct field name

            # Debug: print values
            print(f"Account: {account_name}, Balance: {account_balance}, Rate: {conversion_rate}")

            # Append data
            combined_cashflow['labels'].append(account_name)
            combined_cashflow['balances'].append(account_balance * conversion_rate)

        return jsonify(combined_cashflow), 200

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({"error": "Internal Server Error"}), 500
 



#new entry combined cashflow
@app.route('/cashflow/<userid>', methods=['GET'])
def get_combined_cashflow(userid):
    account_collection = mongo.db.account_collection

    # Fetch all accounts for the user
    accounts = account_collection.find({'userid': userid})

    # Prepare cashflow data
    combined_cashflow = {
        'labels': [],
        'income': [],
        'expenses': [],
        'transfers_in': [],
        'transfers_out': []
    }

    for account in accounts:
        account_name = account['account_name']
        combined_cashflow['labels'].append(account_name)
        combined_cashflow['income'].append(account.get('total_income', 0))
        combined_cashflow['expenses'].append(account.get('total_expense', 0))
        combined_cashflow['transfers_in'].append(account.get('total_transfer_to', 0))
        combined_cashflow['transfers_out'].append(account.get('total_transfer_from', 0))

    return jsonify(combined_cashflow), 200



# Route to insert new expense type and budget
@app.route('/expense-type-budget/<userid>', methods=['POST'])
def create_expense_type_budget(userid):
    expense_type_budget_collection = mongo.db.expense_type_budget
    expense_record_collection = mongo.db.expense_record

    expense_type = request.json.get('expense_type')
    monthly_budget = request.json.get('monthly_budget')
    expense_name = request.json.get('expense_name')

    # Verify that the userid exists
    usertable = mongo.db.usertable
    user = usertable.find_one({'userid': str(userid)})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Calculate expense_this_month
    start_of_month = datetime(datetime.now().year, datetime.now().month, 1)
    end_of_month = (start_of_month + timedelta(days=32)).replace(day=1)

    print(f'Calculating expenses for userid: {userid} for the current month')
    pipeline = [
        {
            '$match': {
                'userid': userid,
                'expense_type': expense_type,  # Match by expense type
                'date': {'$gte': start_of_month, '$lt': end_of_month}
            }
        },
        {
            '$group': {
                '_id': None,
                'total': {'$sum': '$amount'}
            }
        }
    ]
    expense_this_month_result = list(expense_record_collection.aggregate(pipeline))

    # Check if expenses exist for this month
    if expense_this_month_result:
        expense_this_month = expense_this_month_result[0]['total']
    else:
        expense_this_month = 0  # No expenses this month

    # Convert monthly_budget to float before division
    monthly_budget = float(monthly_budget)

    # Calculate budget utilization
    utilization_percentage = (expense_this_month / monthly_budget) * 100 if monthly_budget > 0 else 0

    # Format budget utilization
    if utilization_percentage <= 100:
        budget_utilization = f'Used {round(utilization_percentage, 2)}%, On budget'
    else:
        budget_utilization = f'Used {round(utilization_percentage, 2)}%, Overbudget'

    # Insert a new expense type and budget document, with calculated expense_this_month
    expense_type_budget = {
        'userid': userid,
        'expense_type': expense_type,
        'monthly_budget': monthly_budget,
        'expense_this_month': expense_this_month,  # Set the calculated value
        'budget_utilization': budget_utilization,  # Set the calculated utilization
        'created_at': datetime.now().isoformat()
    }
    expense_type_budget_id = expense_type_budget_collection.insert_one(expense_type_budget).inserted_id

    return jsonify({
        'message': f'Expense type {expense_type} with budget added successfully!',
        'expense_type_budget_id': str(expense_type_budget_id),
        'budget_utilization': budget_utilization
    }), 201


# Fetch expense type and budget
@app.route('/expense-type-budget/<userid>', methods=['GET'])
def get_expense_type_budget(userid):
    expense_type_budget_collection = mongo.db.expense_type_budget
    user_expense_type_budget = expense_type_budget_collection.find({'userid': userid})
    return dumps(user_expense_type_budget)

# Update expense type and budget
@app.route('/expense-type-budget/<userid>/<expense_type_budget_id>', methods=['PUT'])
def update_expense_type_budget(userid,expense_type_budget_id):
    expense_type_budget_collection = mongo.db.expense_type_budget
    data = request.json

    updated_expense_type_budget = expense_type_budget_collection.find_one_and_update(
        {'userid': userid,'_id': ObjectId(expense_type_budget_id)},
        {'$set': data},
        return_document=True
    )

    if updated_expense_type_budget:
        return jsonify({'message': 'Expense type and budget updated successfully!'}), 200
    else:
        return jsonify({'error': 'Expense type and budget not found'}), 404

# Delete expense type and budget
@app.route('/expense-type-budget/<expense_type_budget_id>', methods=['DELETE'])
def delete_expense_type_budget(expense_type_budget_id):
    expense_type_budget_collection = mongo.db.expense_type_budget
    result = expense_type_budget_collection.delete_one({'_id': ObjectId(expense_type_budget_id)})

    if result.deleted_count:
        return jsonify({'message': 'Expense type and budget deleted successfully!'}), 200
    else:
        return jsonify({'error': 'Expense type and budget not found'}), 404

#fetch expense names
@app.route('/expense-types/<userid>', methods=['GET'])
def get_expense_types(userid):
    expense_type_budget_collection = mongo.db.expense_type_budget
    expense_types = expense_type_budget_collection.find({'userid': userid}).distinct('expense_type')
    return jsonify({'expense_types': expense_types})

# Route to insert new income type and target
@app.route('/income-type-target/<userid>', methods=['POST'])
def create_income_type_target(userid):
    income_type_target_collection = mongo.db.income_type_target
    income_type = request.json.get('income_type')
    monthly_target = request.json.get('monthly_target')

    try:
        monthly_target = float(monthly_target)
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid monthly target value'}), 400

    # Verify that the userid exists
    usertable = mongo.db.usertable
    user = usertable.find_one({'userid': str(userid)})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Calculate income_this_month specific to the income type
    start_of_month = datetime(datetime.now().year, datetime.now().month, 1)
    end_of_month = (start_of_month + timedelta(days=32)).replace(day=1)

    income_record_collection = mongo.db.income_record  # Assuming you have an income_record collection

    print(f'Calculating incomes for userid: {userid} and income type: {income_type} for the current month')
    pipeline = [
        {
            '$match': {
                'userid': userid,
                'income_type': income_type,  # Filter by income type
                'date': {'$gte': start_of_month, '$lt': end_of_month}
            }
        },
        {
            '$group': {
                '_id': None,
                'total': {'$sum': '$amount'}
            }
        }
    ]
    income_this_month_result = list(income_record_collection.aggregate(pipeline))
    
    # Calculate total income for the current month for the specific type
    if not income_this_month_result or not income_this_month_result[0].get('total'):
        income_this_month = 0
    else:
        income_this_month = income_this_month_result[0]['total']
    
    # Calculate utilization percentage
    utilization_percentage = (income_this_month / monthly_target) * 100 if monthly_target > 0 else 0
    if utilization_percentage <= 100:
        income_utilization = f'Used {round(utilization_percentage, 2)}%, On target'
    else:
        income_utilization = f'Used {round(utilization_percentage, 2)}%, Above target'

    # Insert a new income type and target document
    income_type_target = {
        'userid': userid,
        'income_type': income_type,
        'monthly_target': monthly_target,
        'income_this_month': income_this_month,
        'income_utilization': income_utilization,
        'created_at': datetime.now().isoformat()
    }
    
    income_type_target_id = income_type_target_collection.insert_one(income_type_target).inserted_id

    return jsonify({
        'message': f'Income type {income_type} with target added successfully!',
        'income_type_target_id': str(income_type_target_id),
        'income_utilization': income_utilization
    }), 201

#fetch income_type and target 
@app.route('/income-type-target/<userid>', methods=['GET'])
def get_income_type_target(userid):
    income_type_target_collection = mongo.db.income_type_target
    user_income_type_target = income_type_target_collection.find({'userid': userid})
    return dumps(user_income_type_target)

# Update income type and target
@app.route('/income-type-target/<userid>/<income_type_target_id>', methods=['PUT'])
def update_income_type_target(userid,income_type_target_id):
    income_type_target_collection = mongo.db.income_type_target
    data = request.json

    updated_income_type_target = income_type_target_collection.find_one_and_update(
        {'userid': userid,'_id': ObjectId(income_type_target_id)},
        {'$set': data},
        return_document=True
    )

    if updated_income_type_target:
        return jsonify({'message': 'Income type and target updated successfully!'}), 200
    else:
        return jsonify({'error': 'Income type and target not found'}), 404

# Delete income type and target
@app.route('/income-type-target/<income_type_target_id>', methods=['DELETE'])
def delete_income_type_target(income_type_target_id):
    income_type_target_collection = mongo.db.income_type_target
    result = income_type_target_collection.delete_one({'_id': ObjectId(income_type_target_id)})

    if result.deleted_count:
        return jsonify({'message': 'Income type and target deleted successfully!'}), 200
    else:
        return jsonify({'error': 'Income type and target not found'}), 404


@app.route('/income-record/<userid>', methods=['POST'])
def create_income_record(userid):
    income_record_collection = mongo.db.income_record

    # Extract and validate the data from the request
    date_str = request.json.get('date')
    if not date_str:
        return jsonify({'error': 'Date is required'}), 400

    try:
        # Convert the date string to a datetime object
        date = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return jsonify({'error': 'Invalid date format. Expected format: YYYY-MM-DD'}), 400

    income_name = request.json.get('income_name')
    try:
        amount = float(request.json.get('amount', 0))
    except ValueError:
        return jsonify({'error': 'Invalid amount format. Expected a number'}), 400

    income_type = request.json.get('income_type')
    account_type = request.json.get('account_type')
    note = request.json.get('note')

    # Verify that the userid exists
    usertable = mongo.db.usertable
    user = usertable.find_one({'userid': str(userid)})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Find the income type target document
    income_type_target_collection = mongo.db.income_type_target
    income_type_target = income_type_target_collection.find_one({'userid': userid, 'income_type': income_type})
    if not income_type_target:
        return jsonify({'error': 'Income type not found'}), 404

    # Ensure monthly_target is a float
    monthly_target = float(income_type_target.get('monthly_target', 0))

    # Find the account type account document
    account_collection = mongo.db.account_collection
    account = account_collection.find_one({'userid': userid, 'account_type': account_type})
    if not account:
        return jsonify({'error': 'Account type not found'}), 404

    # Ensure that ObjectId conversion is valid
    try:
        income_type_id = ObjectId(income_type_target['_id'])
        account_type_id = ObjectId(account['_id'])
    except Exception as e:
        return jsonify({'error': f'Invalid ObjectId: {e}'}), 400

    # Insert a new income record document
    income_record = {
        'userid': userid,
        'date': date,
        'income_name': income_name,
        'amount': amount,
        'income_type_id': income_type_id,
        'account_type_id': account_type_id,
        'note': note
    }
    income_record_id = income_record_collection.insert_one(income_record).inserted_id

    # Calculate the start and end of the current month
    start_of_month = datetime(datetime.now().year, datetime.now().month, 1)
    end_of_month = (start_of_month + timedelta(days=32)).replace(day=1)

    # Calculate total income for the current month for this specific income type
    income_this_month_result = income_record_collection.aggregate([
        {
            '$match': {
                'userid': userid,
                'income_type_id': income_type_id,
                'date': {'$gte': start_of_month, '$lt': end_of_month}
            }
        },
        {
            '$group': {
                '_id': None,
                'total': {'$sum': '$amount'}
            }
        }
    ])

    # Safely retrieve the total from the aggregation result
    income_this_month = next(income_this_month_result, {}).get('total', 0)

    # Calculate utilization percentage
    utilization_percentage = (income_this_month / monthly_target) * 100 if monthly_target else 0

    if utilization_percentage <= 100:
        income_utilization = f'Used {round(utilization_percentage, 2)}%, On Target'
    else:
        income_utilization = f'Used {round(utilization_percentage, 2)}%, Above Target'

    # Update the income_type_target document with the new income_this_month and utilization
    income_type_target_collection.update_one(
        {'_id': income_type_id},
        {
            '$set': {
                'income_this_month': income_this_month,  # Update to current total income
                'income_utilization': income_utilization
            }
        }
    )

    # Update the account balance
    new_balance = account['current_balance'] + amount
    account_collection.update_one(
        {'_id': account['_id']},
        {'$set': {'current_balance': new_balance}}
    )

    return jsonify({
        'message': f'Income record {income_name} added successfully!',
        'income_record_id': str(income_record_id),
        'updated_income_this_month': income_this_month,
        'updated_income_utilization': income_utilization,
        'income_type': income_type_target['income_type'],
        'account_type': account['account_type'],
        'new_balance': new_balance
    }), 201

# Fetch income record
@app.route('/income-record/<userid>', methods=['GET'])
def get_income_record(userid):
    income_record_collection = mongo.db.income_record
    income_type_target_collection = mongo.db.income_type_target
    account_collection = mongo.db.account_collection

    user_income_records = income_record_collection.find({'userid': userid})

    # Prepare the final response with joined data
    response_data = []
    for record in user_income_records:
        # Fetch the income type and account type using their IDs
        income_type_target = income_type_target_collection.find_one(
            {'_id': ObjectId(record['income_type_id'])})
        account = account_collection.find_one(
            {'_id': ObjectId(record['account_type_id'])})

        # Add the income_type and account_type details to the record
        record['income_type'] = income_type_target.get('income_type') if income_type_target else 'Unknown'
        record['account_type'] = account.get('account_type') if account else 'Unknown'

        response_data.append(record)

    return dumps(response_data)
#current month income record
@app.route('/income-record/<userid>/current-month', methods=['GET'])
def get_current_month_income_record(userid):
    income_record_collection = mongo.db.income_record

    # Get the current month and year
    current_month = datetime.now().strftime("%Y-%m")
    current_month_datetime = datetime.strptime(current_month, "%Y-%m")
    
    # Get the first and last day of the current month
    first_day = datetime(current_month_datetime.year, current_month_datetime.month, 1)
    last_day = datetime(current_month_datetime.year, current_month_datetime.month, calendar.monthrange(current_month_datetime.year, current_month_datetime.month)[1])

    # Fetch records for the current month
    user_income_records = income_record_collection.find({
        'userid': userid,
        'date': {'$gte': first_day, '$lt': last_day}
    })
    
    # Return the results as JSON
    return dumps(user_income_records), 200

#update the income record
@app.route('/income-record/<userid>/<income_id>', methods=['PUT'])
def update_income_record(userid, income_id):
    income_record_collection = mongo.db.income_record
    income_type_target_collection = mongo.db.income_type_target
    account_collection = mongo.db.account_collection
    data = request.get_json()
    object_id = ObjectId(income_id)

    # Fetch the existing record by ID
    existing_record = income_record_collection.find_one({'_id': object_id, 'userid': str(userid)})
    if not existing_record:
        return jsonify({'error': 'Income record not found'}), 404

    # Prepare the updated income record
    updated_income_record = {
        'amount': float(data.get('amount', existing_record.get('amount', 0))),
        'description': data.get('description', existing_record.get('description', '')),
        'date': existing_record['date']  # Use the original record date
    }

    # Update the record in the database
    income_record_collection.update_one(
        {'_id': object_id, 'userid': str(userid)},
        {'$set': updated_income_record}
    )

    # Calculate the current month's income total
    current_month_datetime = datetime.now().replace(day=1)
    start_of_month = current_month_datetime
    next_month = (current_month_datetime + timedelta(days=32)).replace(day=1)
    end_of_month = next_month

    # Fetch all income records for the current month (including the updated one)
    incomes = list(income_record_collection.find({
        'userid': str(userid),
        'date': {'$gte': start_of_month, '$lt': end_of_month}
    }))
    
    # Calculate the total income for the current month
    income_this_month = sum(float(income.get('amount', 0)) for income in incomes)

    # Update the income type target utilization
    income_type_id = existing_record['income_type_id']
    income_type_target = income_type_target_collection.find_one({'_id': ObjectId(income_type_id)})
    
    if income_type_target:
        monthly_target = float(income_type_target.get('monthly_target', 0))
        utilization_percentage = (income_this_month / monthly_target) * 100 if monthly_target else 0

        if utilization_percentage <= 100:
            income_utilization = f'Used {round(utilization_percentage, 2)}%, On Target'
        else:
            income_utilization = f'Used {round(utilization_percentage, 2)}%, Above Target'

        # Update the income type target document
        income_type_target_collection.update_one(
            {'_id': ObjectId(income_type_id)},
            {
                '$set': {
                    'income_this_month': income_this_month,
                    'income_utilization': income_utilization
                }
            }
        )

    # Update the account balance
    account_type_id = existing_record['account_type_id']
    account = account_collection.find_one({'_id': ObjectId(account_type_id)})
    
    if account:
        # Calculate the difference between new and old amounts
        new_amount = float(data.get('amount', existing_record.get('amount', 0)))
        old_amount = float(existing_record.get('amount', 0))
        balance_difference = new_amount - old_amount
        new_balance = account['current_balance'] + balance_difference

        # Update the account balance
        account_collection.update_one(
            {'_id': ObjectId(account_type_id)},
            {'$set': {'current_balance': new_balance}}
        )

        return jsonify({
            'message': 'Income record updated successfully!',
            'updated_income_this_month': income_this_month,
            'updated_income_utilization': income_utilization,
            'new_balance': new_balance
        }), 200
    else:
        return jsonify({'error': 'Account not found'}), 404
    
# Delete income record
@app.route('/income-record/<userid>/<income_record_id>', methods=['DELETE'])
def delete_income_record(userid,income_record_id):
    income_record_collection = mongo.db.income_record
    result = income_record_collection.delete_one({'userid':userid,'_id': ObjectId(income_record_id)})

    if result.deleted_count:
        return jsonify({'message': 'Income record deleted successfully!'}), 200
    else:
        return jsonify({'error': 'Income record not found'}), 404
    
#calculate the total income from the income record
def calculate_total_income(userid):
    income_record_collection = mongo.db.income_record

    # Calculate the total income for the user
    total_income = income_record_collection.aggregate([
        {"$match": {"userid": userid}},  # Match all income records for this user
        {"$group": {"_id": None, "total_income": {"$sum": "$amount"}}}  # Sum the amount field
    ])

    # Get the total income result
    total_income_result = list(total_income)  # Convert the cursor to a list
    if total_income_result:
        return total_income_result[0]['total_income']
    else:
        return 0  # If no records found, return 0
@app.route('/total-income/<userid>', methods=['GET'])
def get_total_income(userid):
    # Ensure the userid exists
    usertable = mongo.db.usertable
    user = usertable.find_one({'userid': str(userid)})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Calculate the total income using the separate method
    total_income = calculate_total_income(userid)

    # Return the total income
    return jsonify({
        'userid': userid,
        'total_income': total_income
    }), 200



# Route to insert new expense record
@app.route('/expense-record/<userid>', methods=['POST'])
def create_expense_record(userid):
    expense_record_collection = mongo.db.expense_record
    expense_type_budget_collection = mongo.db.expense_type_budget
    
    # Extract and validate the data from the request
    date_str = request.json.get('date')
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return jsonify({'error': 'Invalid date format. Expected format: YYYY-MM-DD'}), 400

    expense_name = request.json.get('expense_name')
    try:
        amount = float(request.json.get('amount'))
    except ValueError:
        return jsonify({'error': 'Invalid amount format. Expected a number'}), 400

    expense_type = request.json.get('expense_type')
    account_type = request.json.get('account_type')
    note = request.json.get('note')
    
    # Verify that the user exists
    usertable = mongo.db.usertable
    user = usertable.find_one({'userid': str(userid)})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Find the expense type budget document
    expense_type_budget = expense_type_budget_collection.find_one({'userid': userid, 'expense_type': expense_type})
    if not expense_type_budget or '_id' not in expense_type_budget:
        return jsonify({'error': 'Expense type not found or invalid _id'}), 404

    # Find the account document
    account_collection = mongo.db.account_collection
    account = account_collection.find_one({'userid': userid, 'account_type': account_type})
    if not account or '_id' not in account:
        return jsonify({'error': 'Account not found or invalid _id'}), 404

    # Ensure that ObjectId conversion is valid
    try:
        expense_type_id = ObjectId(expense_type_budget['_id'])
        account_type_id = ObjectId(account['_id'])
    except Exception as e:
        return jsonify({'error': f'Invalid ObjectId: {e}'}), 400


    # Calculate the expense this month
    current_month = datetime.now().strftime("%Y-%m")
    current_month_datetime = datetime.strptime(current_month, "%Y-%m")
    last_day = calendar.monthrange(current_month_datetime.year, current_month_datetime.month)[1]
    
    # Create start and end dates for the query
    start_date = datetime(current_month_datetime.year, current_month_datetime.month, 1)
    end_date = datetime(current_month_datetime.year, current_month_datetime.month, last_day) + timedelta(days=1)

    # Query expenses for the current month and specific expense type
    expenses = expense_record_collection.find({
        'userid': userid,
        'expense_type_id': expense_type_id,  # Use the valid ObjectId
        'date': {'$gte': start_date, '$lt': end_date}
    })
    
    expense_this_month = sum(expense['amount'] for expense in expenses)
    
    # Insert the new expense record
    expense_record = {
        'userid': userid,
        'date': date,
        'expense_name': expense_name,
        'amount': amount,
        'expense_type_id': expense_type_id,  
        'account_type_id': account_type_id,
        'note': note,
        'expense_this_month': expense_this_month + amount
    }
    expense_record_id = expense_record_collection.insert_one(expense_record).inserted_id

    # Update the expense type budget document
    updated_expense_this_month = expense_this_month + amount
    monthly_budget = expense_type_budget['monthly_budget']
    utilization_percentage = (updated_expense_this_month / monthly_budget) * 100 if monthly_budget > 0 else 0

    budget_utilization = f'Used {round(utilization_percentage, 2)}%, ' + ('On budget' if utilization_percentage <= 100 else 'Overbudget')

    expense_type_budget_collection.update_one(
        {'_id': expense_type_id},
        {'$set': {
            'expense_this_month': updated_expense_this_month,
            'budget_utilization': budget_utilization
        }}
    )

    # Update the account balance
    if account:
        new_balance = account['current_balance'] - amount
        account_collection.update_one(
            {'_id': account['_id']},
            {'$set': {'current_balance': new_balance}}
        )

    return jsonify({
        'message': f'Expense record {expense_name} added successfully!',
        'expense_record_id': str(expense_record_id),
        'budget_utilization': budget_utilization,
        'new_balance': new_balance
    }), 201


# Fetch expense record
@app.route('/expense-record/<userid>', methods=['GET'])
def get_expense_record(userid):
    expense_record_collection = mongo.db.expense_record
    expense_type_collection = mongo.db.expense_type_budget  # Assuming this holds expense types
    account_collection = mongo.db.account_collection  # Assuming this holds accounts

    user_expense_records = expense_record_collection.find({'userid': userid})

    records = []
    for record in user_expense_records:
        record['_id'] = str(record['_id'])  # Convert ObjectId to string

        # Lookup expense type name
        expense_type = expense_type_collection.find_one({'_id': record['expense_type_id']})
        record['expense_type'] = expense_type['expense_type'] if expense_type else "Unknown"

        # Lookup account type name
        account = account_collection.find_one({'_id': record['account_type_id']})
        record['account_type'] = account['account_type'] if account else "Unknown"

        records.append(record)

    return dumps(records)


#expenses for the current month
@app.route('/expense-record/<userid>/current-month', methods=['GET'])
def get_current_month_expense_record(userid):
    expense_record_collection = mongo.db.expense_record

    # Get the current month and year
    current_month = datetime.now().strftime("%Y-%m")
    current_month_datetime = datetime.strptime(current_month, "%Y-%m")
    
    # Get the first and last day of the current month
    first_day = datetime(current_month_datetime.year, current_month_datetime.month, 1)
    last_day = datetime(current_month_datetime.year, current_month_datetime.month, calendar.monthrange(current_month_datetime.year, current_month_datetime.month)[1])

    # Fetch records for the current month
    user_expense_records = expense_record_collection.find({
        'userid': userid,
        'date': {'$gte': first_day, '$lt': last_day}
    })
    
    # Return the results as JSON
    return dumps(user_expense_records), 200




# Update expense record
@app.route('/expense-record/<userid>/<expense_record_id>', methods=['PUT'])
def update_expense_record(userid, expense_record_id):
    expense_record_collection = mongo.db.expense_record
    expense_type_budget_collection = mongo.db.expense_type_budget
    account_collection = mongo.db.account_collection

    # Fetch the existing record by ID
    existing_record = expense_record_collection.find_one({'_id': ObjectId(expense_record_id), 'userid': userid})
    if not existing_record:
        return jsonify({'error': 'Expense record not found'}), 404

    data = request.json

    # Extract and validate the new amount
    try:
        new_amount = float(data.get('amount', existing_record['amount']))
    except ValueError:
        return jsonify({'error': 'Invalid amount format. Expected a number'}), 400

    # Calculate the difference between the new and old amounts
    old_amount = existing_record['amount']
    amount_difference = new_amount - old_amount

    # Update the expense record with new data
    updated_expense_record = {
        'amount': new_amount,
        'date': datetime.strptime(data.get('date', existing_record['date'].strftime("%Y-%m-%d")), "%Y-%m-%d"),
        'expense_name': data.get('expense_name', existing_record['expense_name']),
        'note': data.get('note', existing_record['note'])
    }

    expense_record_collection.update_one(
        {'_id': ObjectId(expense_record_id)},
        {'$set': updated_expense_record}
    )

    # Recalculate the total expenses for the current month
    current_month = datetime.now().strftime("%Y-%m")
    current_month_datetime = datetime.strptime(current_month, "%Y-%m")
    start_of_month = current_month_datetime.replace(day=1)
    next_month = (current_month_datetime + timedelta(days=32)).replace(day=1)
    end_of_month = next_month

    # Query expenses for the current month excluding the old record
    expenses = list(expense_record_collection.find({
        'userid': userid,
        'date': {'$gte': start_of_month, '$lt': end_of_month},
        '_id': {'$ne': ObjectId(expense_record_id)}
    }))
    
    # Add the updated expense to the list
    expenses.append(updated_expense_record)

    # Calculate the total expense for the current month
    expense_this_month = sum(expense['amount'] for expense in expenses)

    # Fetch the expense type budget and update its utilization
    expense_type_budget = expense_type_budget_collection.find_one({'_id': ObjectId(existing_record['expense_type_id'])})
    if expense_type_budget:
        monthly_budget = float(expense_type_budget.get('monthly_budget', 0))
        utilization_percentage = (expense_this_month / monthly_budget) * 100 if monthly_budget else 0

        if utilization_percentage <= 100:
            budget_utilization = f'Used {round(utilization_percentage, 2)}%, On Budget'
        else:
            budget_utilization = f'Used {round(utilization_percentage, 2)}%, Over Budget'

        # Update the expense type budget document
        expense_type_budget_collection.update_one(
            {'_id': expense_type_budget['_id']},
            {
                '$set': {
                    'expense_this_month': expense_this_month,
                    'budget_utilization': budget_utilization
                }
            }
        )

    # Update the account balance
    account = account_collection.find_one({'_id': ObjectId(existing_record['account_type_id'])})
    if account:
        new_balance = account['current_balance'] - amount_difference
        account_collection.update_one(
            {'_id': account['_id']},
            {'$set': {'current_balance': new_balance}}
        )

    return jsonify({
        'message': 'Expense record updated successfully!',
        'updated_expense_this_month': expense_this_month,
        'updated_budget_utilization': budget_utilization,
        'new_balance': new_balance
    }), 200


# Delete expense record
@app.route('/expense-record/<userid>/<expense_record_id>', methods=['DELETE'])
def delete_expense_record(userid,expense_record_id):
    expense_record_collection = mongo.db.expense_record
    result = expense_record_collection.delete_one({'userid': userid,'_id': ObjectId(expense_record_id)})

    if result.deleted_count:
        return jsonify({'message': 'Expense record deleted successfully!'}), 200
    else:
        return jsonify({'error': 'Expense record not found'}), 404


def calculate_total_expenses(userid):
    expense_record_collection = mongo.db.expense_record

    # Calculate the total expenses for the user
    total_expenses = expense_record_collection.aggregate([
        {"$match": {"userid": userid}},  # Match all expense records for this user
        {"$group": {"_id": None, "total_expenses": {"$sum": "$amount"}}}  # Sum the amount field
    ])

    # Get the total expenses result
    total_expenses_result = list(total_expenses)  # Convert the cursor to a list
    if total_expenses_result:
        return total_expenses_result[0]['total_expenses']
    else:
        return 0  # If no records found, return 0

@app.route('/total-expenses/<userid>', methods=['GET'])
def get_total_expenses(userid):
    # Ensure the userid exists
    usertable = mongo.db.usertable
    user = usertable.find_one({'userid': str(userid)})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Calculate the total expenses using the separate method
    total_expenses = calculate_total_expenses(userid)

    # Return the total expenses with the expected key name
    return jsonify({
        'userid': userid,
        'total_expense': total_expenses  # Change this key name
    }), 200
   
#fetch expense names
@app.route('/expense-names/<userid>', methods=['GET'])
def get_expense_names(userid):
    expense_record_collection = mongo.db.expense_record
    expense_names = expense_record_collection.find({'userid': userid}).distinct('expense_name')
    return jsonify({'expense_names': expense_names})


#route to create transction
@app.route('/transaction/<userid>', methods=['POST'])
def create_transaction(userid):
    transactions = mongo.db.transactions
    accounts = mongo.db.account_collection
    goals = mongo.db.goals

    date = request.json.get('date')
    transfer_name = request.json.get('transfer_name')
    ftype = request.json.get('type')
    amount = float(request.json.get('amount', 0))
    transfer_from = request.json.get('transfer_from')
    transfer_to = request.json.get('transfer_to')
    fund_to_goals = request.json.get('fund_to_goals')

    # Verify that the userid exists
    usertable = mongo.db.usertable
    user = usertable.find_one({'userid': userid})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Verify the transfer_from account if provided
    if transfer_from:
        from_account = accounts.find_one({'account_name': transfer_from})
        if not from_account:
            return jsonify({'error': 'Transfer from account not found'}), 404
        new_balance_from = from_account['current_balance'] - amount
        if new_balance_from < 0:
            return jsonify({'error': 'Insufficient funds in transfer_from account'}), 400

    # Verify the transfer_to account if provided
    if transfer_to:
        to_account = accounts.find_one({'account_name': transfer_to})
        if not to_account:
            return jsonify({'error': 'Transfer to account not found'}), 404
        new_balance_to = to_account['current_balance'] + amount


    # Verify the goal if fund_to_goals is provided
    if fund_to_goals:
        goal = goals.find_one({'goal_id': fund_to_goals})
        if not goal:
            return jsonify({'error': 'Goal not found'}), 404

    # Create transaction document
    transaction = {
        'userid': userid,
        'date': date,
        'transfer_name': transfer_name,
        'amount': amount,
        'type': ftype,
        'transfer_from': transfer_from,
        'transfer_to': transfer_to,
        'fund_to_goals': fund_to_goals,
        'created': datetime.now(),
        'updated': datetime.now()
    }

    # Insert transaction document
    transaction_id = transactions.insert_one(transaction).inserted_id

    # Update the account balances
    if transfer_from:
        accounts.update_one(
            {'account_name': transfer_from},
            {'$set': {'current_balance': new_balance_from}}
        )
    if transfer_to:
        accounts.update_one(
            {'account_name': transfer_to},
            {'$set': {'current_balance': new_balance_to}}
        )

    return jsonify({'message': 'Transaction created successfully!', 'transaction_id': str(transaction_id)}), 201


# Route to fetch transactions for a user
@app.route('/transaction/<userid>', methods=['GET'])
def get_transactions(userid):
    transactions = mongo.db.transactions

    # Find transactions for the specified userid
    user_transactions = transactions.find({'userid': userid})

    # Convert MongoDB cursor to list and jsonify the result
    transactions_list = list(user_transactions)
    return dumps(transactions_list)

# Route to fetch recent transactions 
@app.route('/transaction/<userid>/recent', methods=['GET'])
def get_recent_transactions(userid):
    transactions = mongo.db.transactions
    
    # Get the 'limit' parameter from the query string, default to 10 if not provided
    limit = int(request.args.get('limit', 10))

    # Find transactions for the specified userid, sorted by date in descending order (most recent first)
    user_transactions = transactions.find({'userid': userid}).sort('date', -1).limit(limit)

    # Convert MongoDB cursor to list and jsonify the result
    transactions_list = list(user_transactions)
    return dumps(transactions_list), 200


#update the transaction
@app.route('/transaction/<userid>/<transaction_id>', methods=['PUT'])
def update_transaction(userid, transaction_id):
    transactions = mongo.db.transactions
    accounts = mongo.db.account_collection
    data = request.json

    # Fetch the old transaction to compare with the new data
    old_transaction = transactions.find_one({'userid': userid, '_id': ObjectId(transaction_id)})

    if not old_transaction:
        return jsonify({'error': 'Transaction not found'}), 404

    # Get transfer details and amounts from the new transaction data
    transfer_from = data.get('transfer_from', '').strip()
    transfer_to = data.get('transfer_to', '').strip()
    
    # Ensure the new amount is provided in the request, otherwise set it to 0
    new_amount = float(data.get('amount', 0))

    # Get the old amount, fallback to 0 if it's not present
    old_amount = float(old_transaction.get('amount', 0))

    # Calculate the difference in the amount between the new and old transaction
    amount_diff = new_amount - old_amount

    # Debugging: print out old and new amounts along with the difference
    print(f"Old Amount: {old_amount}, New Amount: {new_amount}, Amount Diff: {amount_diff}")

    # Update the transaction in the database
    updated_transaction = transactions.find_one_and_update(
    {'userid': userid, '_id': ObjectId(transaction_id)},
    {'$set': {**data, 'amount': new_amount}},  # Ensure amount is updated as a float
    return_document=True
    )

    transactions = mongo.db.transactions

    # Find all transactions and update amounts
    for transaction in transactions.find():
        if isinstance(transaction.get('amount'), str):
            try:
                new_amount = float(transaction['amount'])  # Convert to float
                transactions.update_one(
                    {'_id': transaction['_id']},
                    {'$set': {'amount': new_amount}}
                )
                print(f"Updated transaction {transaction['_id']} amount from {transaction['amount']} to {new_amount}")
            except ValueError:
                print(f"Could not convert amount for transaction {transaction['_id']}: {transaction['amount']}")
        

    # Debugging: print out the updated transaction
    print(f"Updated Transaction: {updated_transaction}")

    if updated_transaction:
        # Update the account balances based on the amount difference
        if transfer_from:
            print(f"Querying account: {transfer_from}")
            account_from = accounts.find_one({'account_name': transfer_from})
            if account_from:
                new_balance_from = account_from['current_balance'] - amount_diff
                print(f"Updating transfer_from account: {transfer_from}, Old Balance: {account_from['current_balance']}, New Balance: {new_balance_from}")
                accounts.update_one(
                    {'account_name': transfer_from},
                    {'$set': {'current_balance': new_balance_from}}
                )
            else:
                print(f"Account not found: {transfer_from}")

        if transfer_to:
            print(f"Querying account: {transfer_to}")
            account_to = accounts.find_one({'account_name': transfer_to})
            if account_to:
                new_balance_to = account_to['current_balance'] + amount_diff
                print(f"Updating transfer_to account: {transfer_to}, Old Balance: {account_to['current_balance']}, New Balance: {new_balance_to}")
                accounts.update_one(
                    {'account_name': transfer_to},
                    {'$set': {'current_balance': new_balance_to}}
                )
            else:
                print(f"Account not found: {transfer_to}")

        return jsonify({'message': 'Transaction and account balances updated successfully!'}), 200
    else:
        return jsonify({'error': 'Transaction update failed'}), 404

    
# Delete transaction
@app.route('/transaction/<userid>/<transaction_id>', methods=['DELETE'])
def delete_transaction(userid, transaction_id):
    transactions = mongo.db.transactions
    try:
        transaction_id_obj = ObjectId(transaction_id)
        result = transactions.delete_one({'userid': userid, '_id': transaction_id_obj})
        if result.deleted_count:
            return jsonify({'message': 'Transaction deleted successfully!'}), 200
        else:
            return jsonify({'error': 'Transaction not found'}), 404
    except InvalidId as e:
        return jsonify({'error': 'Invalid transaction ID'}), 400
    except Exception as e:
        app.logger.error(f"Error deleting transaction: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    
# Debugging function to check transaction amounts
def calculate_total_transaction_amount(userid):
    transactions = mongo.db.transactions

    # Aggregate the total transaction amount for the user
    total_transaction = transactions.aggregate([
        {"$match": {"userid": userid}},  # Match all transactions for this user
        {"$group": {"_id": None, "total_transaction_amount": {"$sum": "$amount"}}}  # Sum the amount field
    ])

    # Debug: Print out matched transactions
    print(f"Calculating total transaction for userid: {userid}")
    matched_transactions = list(transactions.find({'userid': userid}))
    print(f"Matched transactions: {matched_transactions}")

    # Get the total transaction result
    total_transaction_result = list(total_transaction)  
    if total_transaction_result:
        total_transaction_amount = total_transaction_result[0]['total_transaction_amount']
        print(f"Total transaction amount: {total_transaction_amount}")
        return total_transaction_amount
    else:
        print("No transactions found or no amount field present.")
        return 0  # If no records found, return 0


@app.route('/total-transaction-amount/<userid>', methods=['GET'])
def get_total_transaction_amount(userid):
    # Ensure the userid exists
    usertable = mongo.db.usertable
    user = usertable.find_one({'userid': str(userid)})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Calculate the total transaction amount
    total_transaction_amount = calculate_total_transaction_amount(userid)

    # Return the total transaction amount
    return jsonify({
        'userid': userid,
        'total_transaction_amount': total_transaction_amount
    }), 200

# Function to calculate due date based on billing cycle
def calculate_due_date(billing_cycle, activation_date=None):
    if not activation_date:
        activation_date = datetime.now()

    if billing_cycle == "Monthly":
        # Add one month to the current date
        due_date = activation_date + timedelta(weeks=4)  
    elif billing_cycle == "Quarterly":
        # Add three months to the current date
        due_date = activation_date + timedelta(weeks=12)  
    elif billing_cycle == "Yearly":
        # Add one year to the current date
        due_date = activation_date.replace(year=activation_date.year + 1)
    else:
        # Default to monthly if not recognized
        due_date = activation_date + timedelta(weeks=4)

    return due_date

# Route to create a new subscription
@app.route('/subscriptions/<userid>', methods=['POST'])
def create_subscription(userid):
    subscriptions = mongo.db.subscriptions
    name = request.json.get('name')
    billing = request.json.get('billing')
    status = request.json.get('status')
    amount = float(request.json.get('amount'))  
    activation_date_str = request.json.get('activation_date', datetime.now().strftime('%Y-%m-%d'))  

    # Convert activation date to datetime object
    activation_date = datetime.strptime(activation_date_str, '%Y-%m-%d')

    # Verify that the userid exists
    usertable = mongo.db.usertable
    user = usertable.find_one({'userid': userid})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Calculate monthly cost based on billing and status
    if status == "Inactive":
        monthly_cost = 0
    elif billing == "Yearly":
        monthly_cost = amount / 12
    elif billing == "Quarterly":
        monthly_cost = amount / 4
    else:  # Default is monthly
        monthly_cost = amount

    # Calculate due date based on billing type
    due_date = calculate_due_date(billing, activation_date)

    # Create subscription document
    subscription = {
        'userid': userid,
        'name': name,
        'billing': billing,
        'status': status,
        'amount': amount,
        'monthly_cost': monthly_cost,
        'due_date': due_date,
        'created': datetime.now(),
        'updated': datetime.now()
    }

    # Insert subscription document
    subscription_id = subscriptions.insert_one(subscription).inserted_id
    return jsonify({'message': 'Subscription created successfully!', 'subscription_id': str(subscription_id)}), 201



@app.route('/subscriptions/update_status', methods=['POST'])
def update_subscription_status():
    subscriptions = mongo.db.subscriptions
    current_time = datetime.now()

    # Find subscriptions where the due date is in the past and the status is still active
    overdue_subscriptions = subscriptions.find({'due_date': {'$lt': current_time}, 'status': 'Active'})

    # Update those subscriptions to inactive
    for subscription in overdue_subscriptions:
        subscriptions.update_one(
            {'_id': subscription['_id']},
            {'$set': {'status': 'Inactive', 'updated': current_time}}
        )

    return jsonify({'message': 'Subscription statuses updated!'}), 200
# Route to fetch subscriptions for a user
@app.route('/subscriptions/<userid>', methods=['GET'])
def get_subscriptions(userid):
    subscriptions = mongo.db.subscriptions

    # Find subscriptions for the specified userid
    user_subscriptions = subscriptions.find({'userid': userid})

    # Convert MongoDB cursor to list and jsonify the result
    subscriptions_list = list(user_subscriptions)
    return dumps(subscriptions_list)

# Update subscription
@app.route('/subscriptions/<userid>/<subscription_id>', methods=['PUT'])
def update_subscription(userid,subscription_id):
    subscriptions= mongo.db.subscriptions
    data = request.json

    updated_subscription = subscriptions.find_one_and_update(
        {'userid': userid,'_id': ObjectId(subscription_id)},
        {'$set': data},
        return_document=True
    )

    if updated_subscription:
        return jsonify({'message': 'subscription updated successfully!'}), 200
    else:
        return jsonify({'error': 'subscription not found'}), 404

# Delete subscription
@app.route('/subscriptions/<userid>/<subscription_id>', methods=['DELETE'])
def delete_subscription(userid,subscription_id):
    subscriptions = mongo.db.subscriptions
    result = subscriptions.delete_one({'userid': userid, '_id': ObjectId(subscription_id)})

    if result.deleted_count:
        return jsonify({'message': 'subscription deleted successfully!'}), 200
    else:
        return jsonify({'error': 'subscription  not found'}), 404



# Route to create a new financial goal
@app.route('/goal/<userid>', methods=['POST'])
def create_goal(userid):
    goals = mongo.db.goals
    name = request.json.get('name')
    target_amount = request.json.get('target_amount')
    current_amount = request.json.get('current_amount')
    due_date = request.json.get('due_date')

    # Verify that the userid exists
    usertable = mongo.db.usertable
    user = usertable.find_one({'userid': userid})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Create goal document
    goal = {
        'userid': userid,
        'name': name,
        'target_amount': target_amount,
        'current_amount': current_amount,
        'due_date': due_date,
        'created': datetime.now(),
        'updated': datetime.now()
    }

    # Insert goal document
    goal_id = goals.insert_one(goal).inserted_id
    return jsonify({'message': 'Financial goal created successfully!', 'goal_id': str(goal_id)}), 201

# Route to fetch financial goals for a user
@app.route('/goals/<userid>', methods=['GET'])
def get_goals(userid):
    goals = mongo.db.goals

    # Find goals for the specified userid
    user_goals = goals.find({'userid': userid})

    # Convert MongoDB cursor to list and jsonify the result
    goals_list = list(user_goals)
    return dumps(goals_list)

# Update goal
@app.route('/goals/<userid>/<goal_id>', methods=['PUT'])
def update_goal(userid,goal_id):
    goals = mongo.db.goals
    data = request.json

    updated_goal = goals.find_one_and_update(
        {'userid': userid,'_id': ObjectId(goal_id)},
        {'$set': data},
        return_document=True
    )

    if updated_goal:
        return jsonify({'message': 'goal updated successfully!'}), 200
    else:
        return jsonify({'error': 'goal not found'}), 404


#Delete goal
@app.route('/goals/<userid>/<goal_id>', methods=['DELETE'])
def delete_goal(userid,goal_id):
    goals = mongo.db.goals
    result = goals.delete_one({'userid': userid, '_id': ObjectId(goal_id)})

    if result.deleted_count:
        return jsonify({'message': 'goal deleted successfully!'}), 200
    else:
        return jsonify({'error': 'goal  not found'}), 404
    
# Route to create a savings entry
@app.route('/savings/<userid>', methods=['POST'])
def create_savings(userid):
    savings = mongo.db.savings
    amount = request.json.get('amount')
    start_date = request.json.get('start_date')
    end_date = request.json.get('end_date')
    

    # Check if user exists
    usertable = mongo.db.usertable
    user = usertable.find_one({'userid': userid})
    if not user:
        return jsonify({'error': 'User not found'}), 404


    # Create savings document
    savings_entry = {
        'userid': userid,
        'amount': amount,
        'start_date': start_date,
        'end_date': end_date,
        'created': datetime.now(),
        'updated': datetime.now()
    }

    # Insert savings document
    savings_id = savings.insert_one(savings_entry).inserted_id
    return jsonify({'message': 'Savings entry created successfully!', 'savings_id': str(savings_id)}), 201

# Route to fetch savings entries for a user
@app.route('/savings/<userid>', methods=['GET'])
def get_savings(userid):
    savings = mongo.db.savings

    # Find savings for the specified user_id
    user_savings = savings.find({'user_id': userid})

    # Convert MongoDB cursor to list and jsonify the result
    savings_list = list(user_savings)
    return dumps(savings_list)

# Route to create a new support ticket
@app.route('/support/<userid>', methods=['POST'])
def create_support_ticket(userid):
    support_tickets = mongo.db.support_tickets
    subject = request.json.get('subject')
    description = request.json.get('description')
    status = request.json.get('status', 'open')  
    
    # Verify that the userid exists
    usertable = mongo.db.usertable
    user = usertable.find_one({'userid': userid})
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Create support ticket document
    ticket = {
        'userid': userid,
        'subject': subject,
        'description': description,
        'status': status,
        'created': datetime.now(),
        'updated': datetime.now()
    }

    # Insert support ticket document
    ticket_id = support_tickets.insert_one(ticket).inserted_id
    return jsonify({'message': 'Support ticket created successfully!', 'ticket_id': str(ticket_id)}), 201

# Route to fetch support tickets for a user
@app.route('/support/<userid>', methods=['GET'])
def get_support_tickets(userid):
    support_tickets = mongo.db.support_tickets

    # Find support tickets for the specified user_id
    user_tickets = support_tickets.find({'userid': userid})

    # Convert MongoDB cursor to list and jsonify the result
    tickets_list = list(user_tickets)
    return dumps(tickets_list)


#subscription back
@app.route('/subscriptions/balance/<userid>', methods=['GET'])
def get_subscriptions_balance(userid):
    subscriptions = mongo.db.subscriptions

    # Find subscriptions for the specified userid
    user_subscriptions = subscriptions.find({'userid': userid})

    subscriptions_list = []
    for sub in user_subscriptions:
        # Calculate remaining balance
        today = datetime.now().date()
        nextpayment_date = datetime.strptime(sub['nextpayment_date'], '%Y-%m-%d').date()
        created_date = sub['created'].date() if isinstance(sub['created'], datetime) else datetime.strptime(sub['created'], '%Y-%m-%d').date()
        total_days = (nextpayment_date - created_date).days
        
        # Check if total_days is zero
        if total_days == 0:
            sub['remaining_balance'] = float(sub['amount'])
        else:
            remaining_days = (nextpayment_date - today).days
            amount = float(sub['amount'])
            daily_amount = amount / total_days
            remaining_balance = daily_amount * remaining_days
            sub['remaining_balance'] = remaining_balance

        subscriptions_list.append(sub)

    return jsonify(subscriptions_list)


@app.route('/api/analyze/<userid>', methods=['GET'])
def analyze_finances(userid):
    try:
        # Validate user existence
        usertable = mongo.db.usertable
        user = usertable.find_one({"userid": str(userid)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Set date range for the current month
        start_date = datetime.now().replace(day=1)
        end_date = (start_date + timedelta(days=32)).replace(day=1)

        # Fetch income, expenses, and budget data
        expenses = list(mongo.db.expense_record.find({
            "userid": userid,
            "date": {"$gte": start_date, "$lt": end_date}
        }))

        income_records = list(mongo.db.income_record.find({
            "userid": userid,
            "date": {"$gte": start_date, "$lt": end_date}
        }))

        budget = mongo.db.expense_type_budget.find_one({
            "userid": userid,
            "month": start_date.strftime('%Y-%m')
        }) or {"monthly_budget": 0}

        # Calculate totals
        total_income = sum(record.get('amount', 0) for record in income_records)
        total_expenses = sum(exp.get('amount', 0) for exp in expenses)
        savings = total_income - total_expenses
        budget_utilization = (total_expenses / budget["monthly_budget"] * 100) if budget["monthly_budget"] else 0

        # Expense breakdown by category
        category_breakdown = {}
        for exp in expenses:
            expense_type_id = exp.get("expense_type_id")
            category = "Unknown"
            if expense_type_id:
                try:
                    expense_type = mongo.db.expense_type_budget.find_one({"_id": ObjectId(expense_type_id)})
                    category = expense_type.get("expense_type", "Unknown") if expense_type else "Unknown"
                except InvalidId:
                    category = "Invalid ID"
            category_breakdown[category] = category_breakdown.get(category, 0) + exp.get("amount", 0)

        return jsonify({
            "total_income": total_income,
            "total_expenses": total_expenses,
            "savings": savings,
            "budget_utilization": round(budget_utilization, 2),
            "category_breakdown": category_breakdown
        }), 200

    except Exception as e:
        print("Error analyzing finances:", str(e))
        print(traceback.format_exc())
        return jsonify({"error": "An internal server error occurred."}), 500
    


@app.route('/posts', methods=['POST'])
def create_post():
    posts = mongo.db.posts
    userid = request.json.get('userid')
    title = request.json.get('title')
    content = request.json.get('content')
    category = request.json.get('category')

    if not userid or not title or not content:
        return jsonify({"error": "Missing required fields"}), 400

    post_id = posts.insert_one({
        "userid": userid,
        "title": title,
        "content": content,
        "category": category,
        "timestamp": datetime.now(),
        "likes": [],
        "comments": []
    }).inserted_id

    return jsonify({"message": "Post created successfully", "post_id": str(post_id)}), 201

@app.route('/posts', methods=['GET'])
def get_posts():
    posts = mongo.db.posts.find()
    post_list = list(posts)
    
    # Get the username for each post by querying the usertable
    for post in post_list:
        post["_id"] = str(post["_id"])
        
        # Fetch the username using the userid
        user = mongo.db.usertable.find_one({"userid": post["userid"]})
        
        # Include the username and other fields from the user collection
        if user:
            post["author"] = {
                "userid": post["userid"],
                "username": user.get("username", "Unknown"),  
                "name": user.get("username", "Unknown User")  
            }
        else:
            post["author"] = {
                "userid": post["userid"],
                "username": "Unknown",
                "name": "Unknown User"
            }

    return jsonify(post_list), 200



@app.route('/posts/<post_id>/comments', methods=['POST'])
def add_comment(post_id):
    comments = mongo.db.comments
    userid = request.json.get('userid')
    content = request.json.get('content')

    if not userid or not content:
        return jsonify({"error": "Missing required fields"}), 400

    comment_id = comments.insert_one({
        "post_id": ObjectId(post_id),
        "userid": userid,
        "content": content,
        "timestamp": datetime.now(),
        "likes": []
    }).inserted_id

    # Add notification logic here
    post = mongo.db.posts.find_one({"_id": ObjectId(post_id)})
    if post:
        mongo.db.notifications.insert_one({
            "userid": post["userid"],
            "message": f"Your post received a new comment!",
            "is_read": False,
            "timestamp": datetime.now()
        })

    return jsonify({"message": "Comment added successfully", "comment_id": str(comment_id)}), 201

@app.route('/posts/<post_id>/like', methods=['POST'])
def like_post(post_id):
    userid = request.json.get('userid')

    if not userid:
        return jsonify({"error": "Missing userid"}), 400

    post = mongo.db.posts.find_one_and_update(
        {"_id": ObjectId(post_id)},
        {"$addToSet": {"likes": userid}},
        return_document=True
    )

    if post:
        return jsonify({"message": "Post liked successfully"}), 200
    else:
        return jsonify({"error": "Post not found"}), 404

@app.route('/notifications/<userid>', methods=['GET'])
def get_notifications(userid):
    notifications = mongo.db.notifications.find({"userid": userid})
    notification_list = list(notifications)
    for notif in notification_list:
        notif["_id"] = str(notif["_id"])
    return jsonify(notification_list), 200


@app.route('/posts/<post_id>/comments', methods=['GET'])
def get_comments(post_id):
    comments = mongo.db.comments.find({"post_id": ObjectId(post_id)})
    comment_list = []
    for comment in comments:
        comment["_id"] = str(comment["_id"])
        comment["post_id"] = str(comment["post_id"])
        comment_list.append(comment)
    return jsonify(comment_list), 200

@app.route('/posts/<post_id>', methods=['DELETE'])
def delete_post(post_id):
    posts = mongo.db.posts
    userid = request.json.get('userid')  

    if not userid:
        return jsonify({"error": "Missing userid"}), 400

    # Find the post by post_id
    post = posts.find_one({"_id": ObjectId(post_id)})

    if not post:
        return jsonify({"error": "Post not found"}), 404

    # Check if the user is the owner of the post
    if post["userid"] != userid:
        return jsonify({"error": "You are not authorized to delete this post"}), 403

    # Delete the post
    posts.delete_one({"_id": ObjectId(post_id)})

    return jsonify({"message": "Post deleted successfully"}), 200



if __name__ == '__main__':
    app.run(debug=True)
