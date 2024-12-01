import uuid
from firebase_admin import firestore

db = firestore.client()

# Define structure for user object in database and create
def create_user(name, phone_number):
    user_id = str(uuid.uuid4())
    user_data = {
        "user_id": user_id,
        "name": name,
        "phone_number": phone_number,
        "wallet_balance": 0.0,
        "community_rating":0,
        "current_loans":0,
        "completed_loans":1,
        "repayment_rate":0.79,
        "credit_score":400,
        "avg_income":2000,
        "current_debt":0
    }
    db.collection("user").document(user_id).set(user_data)
    return user_data

# Get user id
def get_user_by_id(user_id):
    user_ref = db.collection("user").document(user_id)
    user = user_ref.get()
    return user.to_dict() if user.exists else None

# Get user by phone, used for transactions
def get_user_by_phone(phone_number):
    users_ref = db.collection("user")
    query = users_ref.where("phone_number", "==", phone_number).limit(1).get()
    return query[0].to_dict() if query else None

# Updating user with updated object
def update_user(user_id, updates):
    db.collection("user").document(user_id).update(updates)

# Deposit money in end user's account
def deposit_money(user_id, amount):
    user = get_user_by_id(user_id)
    if not user:
        raise ValueError("User not found")

    # Update wallet balance
    new_balance = user["wallet_balance"] + amount
    update_user(user_id, {"wallet_balance": new_balance})

    from transaction_functions import create_transaction  # Import here to avoid circular import
    create_transaction(user_id, "deposit", amount)

    return new_balance

# Get user balance
def get_wallet_balance(user_id):
    user = get_user_by_id(user_id)
    if not user:
        raise ValueError("User not found")

    return {"wallet_balance": user["wallet_balance"]}
