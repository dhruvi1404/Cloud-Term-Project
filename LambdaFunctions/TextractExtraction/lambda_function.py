import boto3
import logging
import re

# Setup logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def extract_table_data(response):
    table_data = []

    # Extract table data from Textract response
    for block in response['Blocks']:
        if block['BlockType'] == 'TABLE':
            for relationship_id in block.get('Relationships', []):
                if relationship_id['Type'] == 'CHILD':
                    for cell_id in relationship_id.get('Ids', []):
                        child_block = next((b for b in response['Blocks'] if b['Id'] == cell_id), None)
                        if child_block and child_block['BlockType'] == 'CELL':
                            cell_text = ''
                            for cell_relationship in child_block.get('Relationships', []):
                                if cell_relationship['Type'] == 'CHILD':
                                    for word_id in cell_relationship.get('Ids', []):
                                        word = next((b for b in response['Blocks'] if b['Id'] == word_id), None)
                                        if word and word['BlockType'] == 'WORD':
                                            cell_text += word['Text'] + ' '

                            cell_text = cell_text.strip()  # Remove leading/trailing whitespace
                            if cell_text:  # Skip empty texts
                                table_data.append(cell_text)

    logger.info("Table data: %s", table_data)

    return table_data

def extract_date_from_raw_text(response):
    raw_text = ''

    # Extract raw text data from Textract response
    for block in response['Blocks']:
        if block['BlockType'] == 'LINE':
            raw_text += block['Text'] + ' '

    logger.info("Raw text data: %s", raw_text)

    # Use regular expression to find dates in the raw text
    dates = re.findall(r'\d{1,2}/\d{1,2}/\d{2,4}', raw_text)
    logger.info("Extracted dates: %s", dates)

    return dates

def lambda_handler(event, context):
    request_body = event

    # Extract user details from the request body
    s3_bucket = request_body.get('bucket_name')
    s3_object_key = request_body.get('image_name')

    textract_client = boto3.client('textract', region_name='us-east-1')

    # Call Textract to analyze the document
    response = textract_client.analyze_document(
        Document={
            'S3Object': {
                'Bucket': s3_bucket,
                'Name': s3_object_key
            }
        },
        FeatureTypes=['TABLES']  # Specify TABLES as the feature type
    )

    logger.info("Textract response: %s", response)

    # Extract table data from the response
    table_data = extract_table_data(response)
    
      # Remove instances of the single character 'F' from the table data
    table_data_filtered = [item for item in table_data if item != 'F']

    logger.info("Filtered table data: %s", table_data_filtered)

    # Process the filtered table data to extract product names, numbers, and prices
    products = []
    for idx in range(0, len(table_data_filtered), 3):
        if idx + 2 < len(table_data_filtered):
            product_name = table_data_filtered[idx]
            product_number = table_data_filtered[idx + 1]
            product_price = table_data_filtered[idx + 2]

            # Clean the price by keeping only digits and decimal point
            product_price = re.sub(r'[^0-9.]', '', product_price)

            # Check if the first element is a string (product name), the second element is a product number, and the third element is a product price
            if isinstance(product_name, str) and isinstance(product_number, str) and isinstance(product_price, str):
                products.append({
                    "name": product_name,
                    "number": product_number,
                    "price": product_price
                })

    logger.info("Extracted products: %s", products)

    # Extract dates from the raw text data
    dates = extract_date_from_raw_text(response)

    # Return the extracted products and dates
    return {"products": products, "dates": dates}
