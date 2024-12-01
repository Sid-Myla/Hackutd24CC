import uuid
from firebase_admin import firestore
from transaction_functions import create_transaction
from user_functions import get_user_by_id, update_user

db = firestore.client()

def enlist_business(owner_id, business_name, description, goal, equity):
    #Allows a user to enlist their business for community investments.
    
    business_id = str(uuid.uuid4())
    business_data = {
        "business_id": business_id,
        "business_name": business_name,
        "description": description,
        "goal": goal,
        "equity": equity,
        "remaining_amount": goal,
        "owner_id": owner_id,
        "stakeholders": []
    }

    # Save to Firestore
    db.collection("businesses").document(business_id).set(business_data)
    return business_data

def invest_in_business(user_id, business_id, amount_invested):
    """
    Allows a user to invest in a business and updates their equity stake.
    Equity is calculated proportionally based on the total investment goal.
    """
    # Fetch business details
    business_ref = db.collection("businesses").document(business_id)
    business = business_ref.get().to_dict()

    if not business:
        raise ValueError("Business not found")

    if business["remaining_amount"] < amount_invested:
        raise ValueError("Investment amount exceeds remaining goal")

    # Get the owner_id from the business document
    owner_id = business.get("owner_id")
    if not owner_id:
        raise ValueError("Business owner not found")

    '''
    Calculate equity share based on total goal and available equity
    Example: If goal is $100k, equity offered is 40%, and investment is $10k
    Then equity_share = ($10k / $100k) * 40% = 4%
    '''
    equity_share = (amount_invested / business["goal"]) * business["equity"]

    # Update business remaining amount and stakeholder information
    business["remaining_amount"] -= amount_invested
    
    # Update or add stakeholder
    stakeholder = next((s for s in business["stakeholders"] if s["user_id"] == user_id), None)
    if stakeholder:
        # If user has existing stake, add to their investment and equity
        stakeholder["amount_invested"] += amount_invested
        stakeholder["equity"] += equity_share
    else:
        # Add new stakeholder
        business["stakeholders"].append({
            "user_id": user_id,
            "amount_invested": amount_invested,
            "equity": equity_share
        })

    # Save updated business data
    business_ref.set(business)

    # Record the investment
    investment_id = str(uuid.uuid4())
    investment_data = {
        "investment_id": investment_id,
        "user_id": user_id,
        "business_id": business_id,
        "amount_invested": amount_invested,
        "equity": equity_share
    }
    db.collection("investments").document(investment_id).set(investment_data)

    # Update user data
    user = get_user_by_id(user_id)
    if not user:
        raise ValueError("User not found")

    # Check if user has sufficient balance
    user_new_balance = user["wallet_balance"] - amount_invested
    if user_new_balance < 0:
        raise ValueError("Insufficient user balance")

    # Update user's wallet balance
    update_user(user_id, {
        "wallet_balance": user_new_balance
    })

    # Record the transaction
    create_transaction(
        user_id,
        "investment",
        amount_invested,
        target_user=owner_id
    )

    return {
        "message": "Investment successful",
        "business": {
            "business_name": business["business_name"],
            "remaining_amount": business["remaining_amount"],
            "total_equity": business["equity"]
        },
        "user_investment": {
            "investment_id": investment_id,
            "amount_invested": amount_invested,
            "equity_share": equity_share
        }
    }



def get_business_investments(business_id):
    #Returns the list of investors and their investments for a specific business.
    
    business_ref = db.collection("businesses").document(business_id)
    business = business_ref.get().to_dict()

    if not business:
        raise ValueError("Business not found")

    return business["stakeholders"]


def get_all_business_info():
    """
    Retrieves all business information from the businesses collection,
    including owner and stakeholder names.
    """
    businesses_ref = db.collection("businesses")
    business_docs = businesses_ref.stream()
    
    businesses = []
    for doc in business_docs:
        business = doc.to_dict()

        # Get owner name
        owner = get_user_by_id(business["owner_id"])
        business["owner_name"] = owner["name"] if owner else "Unknown Owner"

        # Get stakeholder names
        stakeholders_with_names = []
        for stakeholder in business["stakeholders"]:
            user = get_user_by_id(stakeholder["user_id"])
            if user:
                stakeholders_with_names.append({
                    "name": user["name"],
                    "amount_invested": stakeholder["amount_invested"],
                    "equity": stakeholder["equity"],
                    "user_id": stakeholder["user_id"]
                })
            else:
                stakeholders_with_names.append({
                    "name": "Unknown User",
                    "amount_invested": stakeholder["amount_invested"],
                    "equity": stakeholder["equity"]
                })
        
        business["stakeholders"] = stakeholders_with_names
        businesses.append(business)
    
    return {"businesses": businesses}