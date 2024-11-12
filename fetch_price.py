import requests
import sys

def fetch_bitcoin_price():
    response = requests.get('https://api.coindesk.com/v1/bpi/currentprice/USD.json')
    response.raise_for_status()  # Raises HTTPError for bad responses
    data = response.json()
    price = data['bpi']['USD']['rate_float']
    return price

def update_index_html(price):
    try:
        with open('index.html', 'r', encoding='utf-8') as file:
            content = file.read()
        new_content = content.replace('$0.00', f'${price:.2f}')
        with open('index.html', 'w', encoding='utf-8') as file:
            file.write(new_content)
    except Exception as e:
        print(f'Error updating index.html: {e}')
        sys.exit(1)

if __name__ == "__main__":
    try:
        price = fetch_bitcoin_price()
        update_index_html(price)
    except Exception as e:
        print(f'Error fetching Bitcoin price: {e}')
        sys.exit(1)
