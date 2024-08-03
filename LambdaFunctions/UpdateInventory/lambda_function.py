import boto3
import json
import os
import logging


# Setup logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb_table_name = os.environ.get('DYNAMODB_TABLE_NAME')
sns_lambda_function_name = os.environ.get('SNS_LAMBDA_FUNCTION_NAME')

def invoke_sns_email_lambda(user_email, message):
    lambda_client = boto3.client('lambda')

    # Prepare the payload to be passed to the invoked Lambda function
    payload = {
        'email': user_email,
        'message': message
    }

    # Invoke the Lambda function
    response = lambda_client.invoke(
        FunctionName=sns_lambda_function_name,
        InvocationType='Event',  # Use 'Event' for asynchronous invocation
        Payload=json.dumps(payload)
    )

    # Optionally, you can handle the response from the invoked Lambda function here
    # For asynchronous invocation, the response will be minimal as it's for confirmation of the invocation

def lambda_handler(event, context):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(dynamodb_table_name)
    
    logger.info('event: ' + json.dumps(event))  # Convert event to JSON string
    
     # Extract the request body
    if 'body' in event:
         event_body = event['body']  # Use event['body'] directly
    else:
        return {"errorMessage": "Request body not found."}
        
    # Extract the email, products, and date from the event body
    email = event_body.get('email')
    products = event_body.get('products')
    date = event_body.get('date')
    
    logger.info("Email from body : " + email)

    if not email or not products or not date:
        return {"errorMessage": "Invalid input format. 'email', 'products', and 'date' fields are required."}

    # Store the data in DynamoDB
    for product in products:
        product_name = product["name"]
        product_number = product["number"]
        product_price = product["price"]

        table.put_item(
            Item={
                'product': product_name,
                'number': product_number,
                'price': product_price,
                'date': date
            }
        )

    # Send a confirmation email to the user
    message = "Your data has been stored in the database successfully."
    logger.info("Passing this email for email: " + email)
    invoke_sns_email_lambda(email, message)

    # Return success message
    return {"message": "Data stored in the database successfully."}
