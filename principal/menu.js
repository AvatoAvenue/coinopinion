

document.addEventListener("DOMContentLoaded", function () {
    const connectButton = document.getElementById("conectar");

    connectButton.addEventListener("click", function () {
        // Check if Phantom wallet is installed and available
        if (window.solana && window.solana.isPhantom) {
            // Connect to the Phantom wallet
            window.solana.connect();
        } else {
            alert("Phantom Wallet is not installed. Please install it to continue.");
        }
    });
});