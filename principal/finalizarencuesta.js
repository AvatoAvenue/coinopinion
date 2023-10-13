// Función para crear el confeti
function createConfetti() {
    const confettiContainer = document.querySelector(".confetti-container");
    const colors = ["#f06", "#fc6", "#f06", "#ff6"];

    for (let i = 0; i < 200; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.backgroundColor = colors[i % colors.length];
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.animationDuration = 2 + Math.random() * 2 + "s";
        confetti.style.animationDelay = Math.random() * 2 + "s";
        confettiContainer.appendChild(confetti);
    }
}

// Llama a la función de creación de confeti después de cargar la página
window.onload = createConfetti;