const chartData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
        label: 'Precio de SOL en USD',
        data: [140, 145, 152, 158, 160], // Datos de precios
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false
    }]
};

// Configuración del gráfico
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: false
        }
    }
};

// Obtén el contexto del canvas
const ctx = document.getElementById('cryptoChart').getContext('2d');

// Crea el gráfico
const myChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: chartOptions
});

const apiUrl = 'https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=7';

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Aquí tienes los datos de precios en el objeto 'data'
    console.log(data);
    // Procesa y actualiza tu gráfico con estos datos
  })
  .catch(error => {
    console.error('Hubo un error al obtener los datos:', error);
  });
