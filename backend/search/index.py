'''
Business: Search users with compatibility filtering and sorting
Args: event - dict with httpMethod, queryStringParameters (current_user_id, min_compatibility)
      context - object with attributes: request_id, function_name
Returns: HTTP response with list of users and their compatibility scores
'''

import json
import os
from typing import Dict, Any, List
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def get_zodiac_symbol(sign: str) -> str:
    symbols = {
        'Овен': '♈', 'Телец': '♉', 'Близнецы': '♊', 'Рак': '♋',
        'Лев': '♌', 'Дева': '♍', 'Весы': '♎', 'Скорпион': '♏',
        'Стрелец': '♐', 'Козерог': '♑', 'Водолей': '♒', 'Рыбы': '♓'
    }
    return symbols.get(sign, '✨')

def calculate_age(birth_date_str: str) -> int:
    from datetime import datetime
    birth_date = datetime.strptime(str(birth_date_str), '%Y-%m-%d')
    today = datetime.today()
    age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
    return age

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        current_user_id = params.get('current_user_id')
        min_compatibility = int(params.get('min_compatibility', 60))
        limit = int(params.get('limit', 20))
        
        if not current_user_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'current_user_id required'})
            }
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                "SELECT zodiac_sign FROM users WHERE id = %s",
                (current_user_id,)
            )
            current_user = cursor.fetchone()
            
            if not current_user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Current user not found'})
                }
            
            cursor.execute(
                "SELECT u.id, u.name, u.birth_date, u.zodiac_sign, nc.moon_sign, nc.ascendant "
                "FROM users u LEFT JOIN natal_charts nc ON u.id = nc.user_id "
                "WHERE u.id != %s LIMIT %s",
                (current_user_id, limit)
            )
            users = cursor.fetchall()
            
            from backend.natal_chart.index import calculate_compatibility
            
            results = []
            for user in users:
                compatibility_score = calculate_compatibility(
                    current_user['zodiac_sign'],
                    user['zodiac_sign']
                )
                
                if compatibility_score >= min_compatibility:
                    age = calculate_age(user['birth_date'])
                    results.append({
                        'id': user['id'],
                        'name': user['name'],
                        'age': age,
                        'sign': get_zodiac_symbol(user['zodiac_sign']),
                        'zodiac_sign': user['zodiac_sign'],
                        'compatibility': compatibility_score,
                        'initials': ''.join([c[0] for c in user['name'].split()[:2]]).upper()
                    })
            
            results.sort(key=lambda x: x['compatibility'], reverse=True)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'users': results})
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
