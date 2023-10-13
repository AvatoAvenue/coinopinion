document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const registrationForm = document.getElementById("registration-form");
    const walletButton = document.querySelector(".wallet-button");

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Aquí puedes agregar lógica de autenticación, como verificar credenciales en un servidor.
        // Simularemos el inicio de sesión exitoso.
        if (username === "usuario" && password === "contraseña") {
            // Redirigir a la página del usuario
            window.location.href = "usuario.html";
        } else {
            alert("Inicio de sesión fallido. Verifica tus credenciales.");
        }
    });

    registrationForm.addEventListener("submit", function (event) {
        event.preventDefault();
        // Aquí puedes agregar lógica para procesar el registro de un nuevo usuario.
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
    });

    walletButton.addEventListener("click", function () {
        // Redirigir a la página de la cartera
        window.location.href = "cartera.html";
    });
});

