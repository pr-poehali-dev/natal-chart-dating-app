'''
Business: Calculate natal chart and synastry compatibility based on birth data
Args: event - dict with httpMethod, body (birth data), queryStringParameters
      context - object with attributes: request_id, function_name
Returns: HTTP response with natal chart data or compatibility score
'''

import json
import os
from datetime import datetime
from typing import Dict, Any, Optional
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

def calculate_zodiac_sign(birth_date: str) -> str:
    date = datetime.strptime(birth_date, '%Y-%m-%d')
    month = date.month
    day = date.day
    
    zodiac_signs = [
        ('Козерог', 1, 1, 1, 19), ('Водолей', 1, 20, 2, 18),
        ('Рыбы', 2, 19, 3, 20), ('Овен', 3, 21, 4, 19),
        ('Телец', 4, 20, 5, 20), ('Близнецы', 5, 21, 6, 20),
        ('Рак', 6, 21, 7, 22), ('Лев', 7, 23, 8, 22),
        ('Дева', 8, 23, 9, 22), ('Весы', 9, 23, 10, 22),
        ('Скорпион', 10, 23, 11, 21), ('Стрелец', 11, 22, 12, 21),
        ('Козерог', 12, 22, 12, 31)
    ]
    
    for sign, start_month, start_day, end_month, end_day in zodiac_signs:
        if (month == start_month and day >= start_day) or (month == end_month and day <= end_day):
            return sign
    return 'Козерог'

def calculate_compatibility(sign1: str, sign2: str) -> int:
    compatibility_matrix = {
        'Овен': {'Овен': 75, 'Телец': 65, 'Близнецы': 85, 'Рак': 60, 'Лев': 90, 'Дева': 70, 
                 'Весы': 80, 'Скорпион': 65, 'Стрелец': 95, 'Козерог': 60, 'Водолей': 85, 'Рыбы': 70},
        'Телец': {'Овен': 65, 'Телец': 80, 'Близнецы': 70, 'Рак': 90, 'Лев': 75, 'Дева': 95, 
                  'Весы': 85, 'Скорпион': 88, 'Стрелец': 65, 'Козерог': 92, 'Водолей': 70, 'Рыбы': 85},
        'Близнецы': {'Овен': 85, 'Телец': 70, 'Близнецы': 82, 'Рак': 68, 'Лев': 88, 'Дева': 78, 
                     'Весы': 94, 'Скорпион': 72, 'Стрелец': 90, 'Козерог': 65, 'Водолей': 92, 'Рыбы': 75},
        'Рак': {'Овен': 60, 'Телец': 90, 'Близнецы': 68, 'Рак': 85, 'Лев': 70, 'Дева': 88, 
                'Весы': 75, 'Скорпион': 94, 'Стрелец': 62, 'Козерог': 85, 'Водолей': 68, 'Рыбы': 95},
        'Лев': {'Овен': 90, 'Телец': 75, 'Близнецы': 88, 'Рак': 70, 'Лев': 82, 'Дева': 72, 
                'Весы': 85, 'Скорпион': 75, 'Стрелец': 93, 'Козерог': 68, 'Водолей': 88, 'Рыбы': 73},
        'Дева': {'Овен': 70, 'Телец': 95, 'Близнецы': 78, 'Рак': 88, 'Лев': 72, 'Дева': 85, 
                 'Весы': 80, 'Скорпион': 90, 'Стрелец': 68, 'Козерог': 94, 'Водолей': 75, 'Рыбы': 82},
        'Весы': {'Овен': 80, 'Телец': 85, 'Близнецы': 94, 'Рак': 75, 'Лев': 85, 'Дева': 80, 
                 'Весы': 83, 'Скорпион': 78, 'Стрелец': 88, 'Козерог': 72, 'Водолей': 95, 'Рыбы': 78},
        'Скорпион': {'Овен': 65, 'Телец': 88, 'Близнецы': 72, 'Рак': 94, 'Лев': 75, 'Дева': 90, 
                     'Весы': 78, 'Скорпион': 86, 'Стрелец': 70, 'Козерог': 92, 'Водолей': 73, 'Рыбы': 93},
        'Стрелец': {'Овен': 95, 'Телец': 65, 'Близнецы': 90, 'Рак': 62, 'Лев': 93, 'Дева': 68, 
                    'Весы': 88, 'Скорпион': 70, 'Стрелец': 84, 'Козерог': 67, 'Водолей': 91, 'Рыбы': 72},
        'Козерог': {'Овен': 60, 'Телец': 92, 'Близнецы': 65, 'Рак': 85, 'Лев': 68, 'Дева': 94, 
                    'Весы': 72, 'Скорпион': 92, 'Стрелец': 67, 'Козерог': 87, 'Водолей': 70, 'Рыбы': 83},
        'Водолей': {'Овен': 85, 'Телец': 70, 'Близнецы': 92, 'Рак': 68, 'Лев': 88, 'Дева': 75, 
                    'Весы': 95, 'Скорпион': 73, 'Стрелец': 91, 'Козерог': 70, 'Водолей': 84, 'Рыбы': 77},
        'Рыбы': {'Овен': 70, 'Телец': 85, 'Близнецы': 75, 'Рак': 95, 'Лев': 73, 'Дева': 82, 
                 'Весы': 78, 'Скорпион': 93, 'Стрелец': 72, 'Козерог': 83, 'Водолей': 77, 'Рыбы': 88}
    }
    
    return compatibility_matrix.get(sign1, {}).get(sign2, 70)

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
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            if action == 'create_profile':
                name = body_data.get('name')
                email = body_data.get('email')
                birth_date = body_data.get('birth_date')
                birth_time = body_data.get('birth_time')
                birth_city = body_data.get('birth_city')
                
                zodiac_sign = calculate_zodiac_sign(birth_date)
                moon_sign = calculate_zodiac_sign(birth_date)
                ascendant_sign = calculate_zodiac_sign(birth_date)
                
                cursor.execute(
                    "INSERT INTO users (name, email, birth_date, birth_time, birth_city, zodiac_sign, moon_sign, ascendant_sign) "
                    "VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
                    (name, email, birth_date, birth_time, birth_city, zodiac_sign, moon_sign, ascendant_sign)
                )
                user_id = cursor.fetchone()['id']
                
                cursor.execute(
                    "INSERT INTO natal_charts (user_id, sun_sign, moon_sign, ascendant) VALUES (%s, %s, %s, %s)",
                    (user_id, zodiac_sign, moon_sign, ascendant_sign)
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'user_id': user_id,
                        'zodiac_sign': zodiac_sign,
                        'moon_sign': moon_sign,
                        'ascendant': ascendant_sign
                    })
                }
            
            elif action == 'update_birth_data':
                user_id = body_data.get('user_id')
                birth_date = body_data.get('birth_date')
                birth_time = body_data.get('birth_time')
                birth_city = body_data.get('birth_city')
                
                zodiac_sign = calculate_zodiac_sign(birth_date)
                
                cursor.execute(
                    "UPDATE users SET birth_date = %s, birth_time = %s, birth_city = %s, zodiac_sign = %s "
                    "WHERE id = %s",
                    (birth_date, birth_time, birth_city, zodiac_sign, user_id)
                )
                
                cursor.execute(
                    "INSERT INTO natal_charts (user_id, sun_sign, moon_sign, ascendant) "
                    "VALUES (%s, %s, %s, %s) "
                    "ON CONFLICT DO NOTHING",
                    (user_id, zodiac_sign, zodiac_sign, zodiac_sign)
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'success': True,
                        'zodiac_sign': zodiac_sign
                    })
                }
            
            elif action == 'calculate_compatibility':
                user1_id = body_data.get('user1_id')
                user2_id = body_data.get('user2_id')
                
                cursor.execute("SELECT zodiac_sign FROM users WHERE id = %s", (user1_id,))
                user1 = cursor.fetchone()
                cursor.execute("SELECT zodiac_sign FROM users WHERE id = %s", (user2_id,))
                user2 = cursor.fetchone()
                
                if not user1 or not user2:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'isBase64Encoded': False,
                        'body': json.dumps({'error': 'User not found'})
                    }
                
                compatibility_score = calculate_compatibility(user1['zodiac_sign'], user2['zodiac_sign'])
                
                cursor.execute(
                    "INSERT INTO compatibility_cache (user1_id, user2_id, compatibility_score) "
                    "VALUES (%s, %s, %s) ON CONFLICT (user1_id, user2_id) DO UPDATE SET compatibility_score = %s",
                    (user1_id, user2_id, compatibility_score, compatibility_score)
                )
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({
                        'compatibility_score': compatibility_score,
                        'user1_sign': user1['zodiac_sign'],
                        'user2_sign': user2['zodiac_sign']
                    })
                }
        
        finally:
            cursor.close()
            conn.close()
    
    if method == 'GET':
        params = event.get('queryStringParameters', {})
        user_id = params.get('user_id')
        
        if not user_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'user_id required'})
            }
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                "SELECT u.*, nc.sun_sign, nc.moon_sign, nc.ascendant "
                "FROM users u LEFT JOIN natal_charts nc ON u.id = nc.user_id WHERE u.id = %s",
                (user_id,)
            )
            user = cursor.fetchone()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'User not found'})
                }
            
            user_data = dict(user)
            if 'birth_date' in user_data and user_data['birth_date']:
                user_data['birth_date'] = str(user_data['birth_date'])
            if 'birth_time' in user_data and user_data['birth_time']:
                user_data['birth_time'] = str(user_data['birth_time'])
            if 'created_at' in user_data and user_data['created_at']:
                user_data['created_at'] = str(user_data['created_at'])
            if 'updated_at' in user_data and user_data['updated_at']:
                user_data['updated_at'] = str(user_data['updated_at'])
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(user_data)
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