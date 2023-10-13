// Función para transferir saldo
document.getElementById("transferirSaldo").addEventListener("click", function () {
    window.location.href = "transfercash.html";
});

// Función para agregar una tarjeta
document.getElementById("agregarTarjeta").addEventListener("click", function () {
  const nuevaTarjeta = document.createElement("div");
  nuevaTarjeta.className = "tarjeta"; // Aplica la clase de estilo que tengas para las tarjetas

  // Crea la estructura de la tarjeta
  const tarjetaHTML = `
  <section class="tarjeta_container">
  <div class="tarjeta">               
      <div class="card">
          <div class="visa_logo">
              <img src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/visa.png" alt="">
          </div>
          <div class="visa_info">
              <img src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png" alt="">
              <p>**** **** **** 6344</p> 
          </div>
      </div>
  </div>
  `;

  // Asigna el HTML a la nueva tarjeta
  nuevaTarjeta.innerHTML = tarjetaHTML;

  // Obtiene una referencia al contenedor de tarjetas
  const tarjetasContainer = document.querySelector(".tarjeta_container");

  // Agrega la nueva tarjeta al contenedor
  tarjetasContainer.appendChild(nuevaTarjeta);
});

// Función para volver atrás
document.getElementById("Menu").addEventListener("click", function () {
    // Aquí puedes agregar la lógica para volver atrás, por ejemplo, redirigir a la página anterior
    window.location.href = "menu.html";
});