'''
Business: Manage chat messages between users
Args: event - dict with httpMethod, body (chat operations), queryStringParameters (user_id)
      context - object with attributes: request_id, function_name
Returns: HTTP response with chat messages or operation status
'''

import json
import os
from typing import Dict, Any
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    database_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(database_url, cursor_factory=RealDictCursor)

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
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
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
            
            cursor.execute(
                "SELECT c.id as chat_id, c.user1_id, c.user2_id, "
                "CASE WHEN c.user1_id = %s THEN u2.name ELSE u1.name END as other_user_name, "
                "CASE WHEN c.user1_id = %s THEN u2.id ELSE u1.id END as other_user_id, "
                "CASE WHEN c.user1_id = %s THEN u2.zodiac_sign ELSE u1.zodiac_sign END as other_user_sign "
                "FROM chats c "
                "JOIN users u1 ON c.user1_id = u1.id "
                "JOIN users u2 ON c.user2_id = u2.id "
                "WHERE c.user1_id = %s OR c.user2_id = %s",
                (user_id, user_id, user_id, user_id, user_id)
            )
            chats = cursor.fetchall()
            
            chat_list = []
            for chat in chats:
                cursor.execute(
                    "SELECT message_text, created_at, sender_id FROM messages "
                    "WHERE chat_id = %s ORDER BY created_at DESC LIMIT 1",
                    (chat['chat_id'],)
                )
                last_message = cursor.fetchone()
                
                cursor.execute(
                    "SELECT COUNT(*) as unread_count FROM messages "
                    "WHERE chat_id = %s AND sender_id = %s AND is_read = FALSE",
                    (chat['chat_id'], chat['other_user_id'])
                )
                unread = cursor.fetchone()
                
                chat_list.append({
                    'chat_id': chat['chat_id'],
                    'other_user_id': chat['other_user_id'],
                    'other_user_name': chat['other_user_name'],
                    'other_user_sign': chat['other_user_sign'],
                    'last_message': last_message['message_text'] if last_message else '',
                    'last_message_time': str(last_message['created_at']) if last_message else '',
                    'unread_count': unread['unread_count']
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'chats': chat_list})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'create_chat':
                user1_id = body_data.get('user1_id')
                user2_id = body_data.get('user2_id')
                
                cursor.execute(
                    "INSERT INTO chats (user1_id, user2_id) VALUES (%s, %s) "
                    "ON CONFLICT (user1_id, user2_id) DO NOTHING RETURNING id",
                    (user1_id, user2_id)
                )
                result = cursor.fetchone()
                
                if result:
                    chat_id = result['id']
                else:
                    cursor.execute(
                        "SELECT id FROM chats WHERE "
                        "(user1_id = %s AND user2_id = %s) OR (user1_id = %s AND user2_id = %s)",
                        (user1_id, user2_id, user2_id, user1_id)
                    )
                    chat_id = cursor.fetchone()['id']
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'chat_id': chat_id})
                }
            
            elif action == 'send_message':
                chat_id = body_data.get('chat_id')
                sender_id = body_data.get('sender_id')
                message_text = body_data.get('message_text')
                
                cursor.execute(
                    "INSERT INTO messages (chat_id, sender_id, message_text) VALUES (%s, %s, %s) RETURNING id",
                    (chat_id, sender_id, message_text)
                )
                message_id = cursor.fetchone()['id']
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'message_id': message_id, 'status': 'sent'})
                }
            
            elif action == 'get_messages':
                chat_id = body_data.get('chat_id')
                limit = body_data.get('limit', 50)
                
                cursor.execute(
                    "SELECT m.id, m.sender_id, m.message_text, m.created_at, u.name as sender_name "
                    "FROM messages m JOIN users u ON m.sender_id = u.id "
                    "WHERE m.chat_id = %s ORDER BY m.created_at DESC LIMIT %s",
                    (chat_id, limit)
                )
                messages = cursor.fetchall()
                
                messages_list = [dict(msg) for msg in messages]
                messages_list.reverse()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'messages': messages_list})
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
