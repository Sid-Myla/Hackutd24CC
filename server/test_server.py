import unittest
from server import app

class FlaskAppTests(unittest.TestCase):
    def setUp(self):
        # Create a test client
        self.app = app.test_client()
        self.app.testing = True

    def test_ping(self):
        # Simulate GET request
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), "Hello, Flask from server.py!")

    def create_user(self):
        response = self.app.post('/users/create', json={'name': 'John','phone_number':123456789})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"message": "User created successfully", "user": "John"})

    def test_fraud_detection(self):
        response = self.app.post('/fraud', json={'message': "Congratulations! You’ve been pre-approved for a $50,000 loan with 0% interest. To claim this offer, simply provide your banking information: [Apply Now]. Hurry! This offer is valid for the next 24 hours. Sincerely, Loan Department."})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), "Match ID: 11, Score: 0.989761651, Fraudulent: Fraudulent")

if __name__ == '__main__':
    unittest.main()
