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

const conectarButton = document.getElementById("conectar");

// Agrega un Event Listener al botón "conectar" para iniciar sesión
conectarButton.addEventListener("click", async () => {
    await signIn();
});

    //Funcion para Iniciar sesion con nuestra Wallet de Phantom
    const signIn = async () => {
        //Si phantom no esta instalado
        const provider = window?.phantom?.solana;
        const { solana } = window;

        if (!provider?.isPhantom || !solana.isPhantom) {
            toast.error("Phantom no esta instalado");
            setTimeout(() => {
                window.open("https://phantom.app/", "_blank");
            }, 2000);
            return;
        }
        //Si phantom esta instalado
        let phantom;
        if (provider?.isPhantom) phantom = provider;

        const { publicKey } = await phantom.connect(); //conecta a phantom
        console.log("publicKey", publicKey.toString()); //muestra la publicKey
        setPublicKey(publicKey.toString()); //guarda la publicKey en el state
        window.localStorage.setItem("publicKey", publicKey.toString()); //guarda la publicKey en el localStorage

        toast.success("Tu Wallet esta conectada");

        getBalances(publicKey);
    };

    //Funcion para obtener el balance de nuestra wallet

    const getBalances = async (publicKey) => {
        try {
            const connection = new Connection(
                clusterApiUrl(SOLANA_NETWORK),
                "confirmed"
            );

            const balance = await connection.getBalance(
                new PublicKey(publicKey)
            );

            const balancenew = balance / LAMPORTS_PER_SOL;
            setBalance(balancenew);
        } catch (error) {
            console.error("ERROR GET BALANCE", error);
            toast.error("Something went wrong getting the balance");
        }
    };