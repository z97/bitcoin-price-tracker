import requests
import sys

def fetch_bitcoin_price():
    try:
        response = requests.get('https://api.coindesk.com/v1/bpi/currentprice/USD.json')
        response.raise_for_status()  # Ensure we notice bad responses
        data = response.json()
        price = data['bpi']['USD']['rate_float']
        print(f"Fetched Bitcoin price: {price}")
        return price
    except Exception as e:
        print(f"Error fetching Bitcoin price: {e}")
        sys.exit(1)

def update_index_html(price):
    try:
        with open('index.html', 'r', encoding='utf-8') as file:
            content = file.read()
        if '$0.00' in content:
            formatted_price = f"${price:,.2f}"
            new_content = content.replace('$0.00', formatted_price)
        else:
            print("Placeholder '$0.00' not found in index.html")
            sys.exit(1)
        with open('index.html', 'w', encoding='utf-8') as file:
            file.write(new_content)
        print("index.html updated successfully.")
    except Exception as e:
        print(f"Error updating index.html: {e}")
        sys.exit(1)

if __name__ == "__main__":
    price = fetch_bitcoin_price()
    update_index_html(price)
