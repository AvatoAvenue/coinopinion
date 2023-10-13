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

  document.addEventListener("DOMContentLoaded", function () {
    // Datos de ejemplo para la gráfica de barras
    const labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo"];
    const data = [1000, 1200, 800, 1500, 2000]; // Reemplaza con tus propios datos

    // Obtén el contexto del canvas
    const ctx = document.getElementById("crypto-chart").getContext("2d");

    // Configuración de la gráfica de barras
    const myChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Balance de Solana",
                data: data,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Datos de ejemplo para la gráfica de barras
    const barLabels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo"];
    const barData = [1000, 1200, 800, 1500, 2000]; // Reemplaza con tus propios datos

    // Datos de ejemplo para la gráfica de pastel
    const pieLabels = ["Bitcoin", "Ethereum", "Solana", "Cardano"];
    const pieData = [40, 25, 20, 15]; // Reemplaza con tus propios datos

    // Configuración de la gráfica de barras
    const barCtx = document.getElementById("crypto-bar-chart").getContext("2d");
    const barChart = new Chart(barCtx, {
        type: "bar",
        data: {
            labels: barLabels,
            datasets: [{
                label: "Balance de Solana",
                data: barData,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Configuración de la gráfica de pastel
    const pieCtx = document.getElementById("crypto-pie-chart").getContext("2d");
    const pieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
            labels: pieLabels,
            datasets: [{
                data: pieData,
                backgroundColor: ["#FF5733", "#FFC300", "#33FF57", "#33C7FF"],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
});
