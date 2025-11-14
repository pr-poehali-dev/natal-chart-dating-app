'''
Business: User authentication - registration, login, session management
Args: event - dict with httpMethod, body (email, password, name)
      context - object with attributes: request_id, function_name
Returns: HTTP response with auth token or user data
'''

import json
import os
import hashlib
import secrets
from typing import Dict, Any
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def hash_password(password: str, salt: str = None) -> tuple:
    if not salt:
        salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return pwd_hash.hex(), salt

def create_session_token() -> str:
    return secrets.token_urlsafe(32)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            if action == 'register':
                email = body_data.get('email')
                password = body_data.get('password')
                name = body_data.get('name')
                
                cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
                existing_user = cursor.fetchone()
                
                if existing_user:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Email already registered'})
                    }
                
                pwd_hash, salt = hash_password(password)
                
                cursor.execute(
                    "INSERT INTO users (name, email, birth_date, birth_time, birth_city, zodiac_sign) "
                    "VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                    (name, email, '2000-01-01', '12:00:00', 'Unknown', 'Неизвестно')
                )
                user_id = cursor.fetchone()['id']
                
                cursor.execute(
                    "INSERT INTO user_credentials (user_id, password_hash, salt) VALUES (%s, %s, %s)",
                    (user_id, pwd_hash, salt)
                )
                
                session_token = create_session_token()
                expires_at = datetime.now() + timedelta(days=30)
                
                cursor.execute(
                    "INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (%s, %s, %s)",
                    (user_id, session_token, expires_at)
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'user_id': user_id,
                        'name': name,
                        'email': email,
                        'session_token': session_token
                    })
                }
            
            elif action == 'login':
                email = body_data.get('email')
                password = body_data.get('password')
                
                cursor.execute(
                    "SELECT u.id, u.name, u.email, uc.password_hash, uc.salt "
                    "FROM users u JOIN user_credentials uc ON u.id = uc.user_id WHERE u.email = %s",
                    (email,)
                )
                user = cursor.fetchone()
                
                if not user:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Invalid email or password'})
                    }
                
                pwd_hash, _ = hash_password(password, user['salt'])
                
                if pwd_hash != user['password_hash']:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Invalid email or password'})
                    }
                
                session_token = create_session_token()
                expires_at = datetime.now() + timedelta(days=30)
                
                cursor.execute(
                    "INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (%s, %s, %s)",
                    (user['id'], session_token, expires_at)
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'user_id': user['id'],
                        'name': user['name'],
                        'email': user['email'],
                        'session_token': session_token
                    })
                }
            
            elif action == 'verify_token':
                session_token = body_data.get('session_token')
                
                cursor.execute(
                    "SELECT u.id, u.name, u.email, us.expires_at "
                    "FROM users u JOIN user_sessions us ON u.id = us.user_id "
                    "WHERE us.session_token = %s",
                    (session_token,)
                )
                session = cursor.fetchone()
                
                if not session:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Invalid session token'})
                    }
                
                if datetime.now() > session['expires_at']:
                    return {
                        'statusCode': 401,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'Session expired'})
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'user_id': session['id'],
                        'name': session['name'],
                        'email': session['email']
                    })
                }
        
        finally:
            cursor.close()
            conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }