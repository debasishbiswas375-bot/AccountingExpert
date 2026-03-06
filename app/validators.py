import re

def validate_username(username: str):
    if len(username) < 6:
        raise ValueError("Username must be at least 6 characters")

    if not re.match("^[A-Za-z0-9]+$", username):
        raise ValueError("Username must contain only letters and numbers")
