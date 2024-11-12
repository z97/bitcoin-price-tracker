// functions/fetch-bitcoin-price.js

let cachedPrice = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 60 seconds

exports.handler = async function(event, context) {
  const currentTime = Date.now();

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
    // Fetch new data from CoinDesk API
    try {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/USD.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const price = data.bpi.USD.rate_float.toFixed(2);

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
