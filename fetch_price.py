import requests

def fetch_bitcoin_price():
    response = requests.get('https://api.coindesk.com/v1/bpi/currentprice/USD.json')
    data = response.json()
    price = data['bpi']['USD']['rate_float']
    return price

def update_index_html(price):
    with open('index.html', 'r') as file:
        content = file.read()
    new_content = content.replace('$0.00', f'${price:.2f}')
    with open('index.html', 'w') as file:
        file.write(new_content)

if __name__ == "__main__":
    price = fetch_bitcoin_price()
    update_index_html(price)
