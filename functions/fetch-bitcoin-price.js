// functions/fetch-bitcoin-price.js

exports.handler = async function(event, context) {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  const apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
  const symbol = 'BTC';

  try {
    const response = await fetch(`${apiUrl}?symbol=${symbol}`, {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Access the price data
    const price = data.data[symbol].quote.USD.price.toFixed(2);

    // Return the price
    return {
      statusCode: 200,
      body: JSON.stringify({ price }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching Bitcoin price' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

