const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice/USD.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const price = data.bpi.USD.rate_float.toFixed(2);

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
