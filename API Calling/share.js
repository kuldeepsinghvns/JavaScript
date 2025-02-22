const apiKey = 'cuh01d1r01qr6jndsbigcuh01d1r01qr6jndsbj0'; // Replace with your Finnhub API key

// Elements
const fetchButton = document.getElementById('fetchData');
const symbolInput = document.getElementById('symbol');
const stockName = document.getElementById('stockName');
const currentPrice = document.getElementById('currentPrice');
const highPrice = document.getElementById('highPrice');
const lowPrice = document.getElementById('lowPrice');
const stockChart = document.getElementById('stockChart');

// Fetch stock data function
fetchButton.addEventListener('click', () => {
  const symbol = symbolInput.value.toUpperCase().trim();
  
  if (!symbol) {
    alert('Please enter a valid stock symbol');
    return;
  }

  // Correct symbol format (e.g., RELIANCE.NS for NSE)
  let formattedSymbol = symbol;
  if (!symbol.includes('.BO') && !symbol.includes('.NS')) {
    formattedSymbol = `${symbol}.NS`; // Automatically append .NS for NSE
  }

  // Finnhub API URL for historical data (for Candlestick chart)
  const from = Math.floor(new Date('2023-01-01').getTime() / 1000); // January 1, 2023
  const to = Math.floor(new Date('2023-02-01').getTime() / 1000);   // February 1, 2023
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${formattedSymbol}&resolution=D&from=${from}&to=${to}&token=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.s !== "ok") {
        alert('Error: Invalid Stock Symbol or Data not available');
        return;
      }

      // Display stock details
      stockName.textContent = `Stock: ${symbol}`;
      currentPrice.textContent = `Current Price: $${data.c[data.c.length - 1]}`;
      highPrice.textContent = `High Price: $${Math.max(...data.h)}`;
      lowPrice.textContent = `Low Price: $${Math.min(...data.l)}`;

      // Prepare data for candlestick chart
      const chartData = {
        labels: data.t.map(timestamp => new Date(timestamp * 1000).toLocaleDateString()), // Date labels
        datasets: [{
          label: `${symbol} Candlestick`,
          data: data.c.map((close, index) => ({
            t: data.t[index] * 1000, // Timestamp
            o: data.o[index], // Open
            h: data.h[index], // High
            l: data.l[index], // Low
            c: close // Close
          })),
          borderColor: 'black',
          borderWidth: 1,
          backgroundColor: (context) => {
            const { datasetIndex, dataIndex } = context;
            const currentData = context.chart.data.datasets[datasetIndex].data[dataIndex];
            return currentData.c > currentData.o ? 'green' : 'red'; // Green if price up, red if price down
          }
        }]
      };

      // Create the candlestick chart using Chart.js
      const chart = new Chart(stockChart, {
        type: 'candlestick', // Candlestick chart type
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day'
              },
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Price (USD)'
              }
            }
          }
        }
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      alert('Error fetching stock data');
    });
});
