import boto3
import sys
from datetime import datetime, timedelta, timezone
import uuid
import os

class Ddb:
    @staticmethod
    def list_message_groups(client,my_user_uuid):
        year = str(datetime.now().year)
        table_name = 'cruddur-messages'
        query_params = {
          'TableName': table_name,
          'KeyConditionExpression': 'pk = :pk AND begins_with(sk,:year)',
          'ScanIndexForward': False,
          'Limit': 20,
          'ExpressionAttributeValues': {
            ':year': {'S': year },  
            ':pk': {'S': f"GRP#{my_user_uuid}"}
          }
        }
        print('query-params:',query_params)
        print(query_params)

    #Funcion client David
    def client():
        return boto3.client('dynamodb')    

        # query the table
        response = client.query(**query_params)
        items = response['Items']

        print("items::", items)
        results = []
        for item in items:
          last_sent_at = item['sk']['S']
          results.append({
            'uuid': item['message_group_uuid']['S'],
            'display_name': item['user_display_name']['S'],
            'handle': item['user_handle']['S'],
            'message': item['message']['S'],
            'created_at': last_sent_at
          })
        return results