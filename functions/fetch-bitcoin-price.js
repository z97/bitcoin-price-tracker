// functions/fetch-bitcoin-price.js

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

let cachedPrice = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 60 seconds

exports.handler = async function(event, context) {
  const currentTime = Date.now();
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  const apiUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
  const symbol = 'BTC';

  if (cachedPrice && (currentTime - lastFetchTime) < CACHE_DURATION) {
    // Serve from cache
    return {
      statusCode: 200,
      body: JSON.stringify({ price: cachedPrice }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } else {
    // Fetch new data from CoinMarketCap API
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
      const price = data.data[symbol].quote.USD.price.toFixed(2);

      // Update cache
      cachedPrice = price;
      lastFetchTime = currentTime;

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
  }
};

