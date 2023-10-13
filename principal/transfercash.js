const SOLANA_NETWORK = "devnet";

let publicKey = null;
let balance = 0;
let receiver = null;
let amount = null;
let explorerLink = null;
let uploadUrl = null;
let url = null;
let statusText = "";

const getBalances = async (publicKey) => {
    try {
        const connection = new Connection(
            clusterApiUrl(SOLANA_NETWORK),
            "confirmed"
        );

        const balance = await connection.getBalance(new PublicKey(publicKey));

        const balancenew = balance / LAMPORTS_PER_SOL;
        balance = balancenew;
        console.log(balance);
    } catch (error) {
        console.error("ERROR GET BALANCE", error);
        toast.error("Something went wrong getting the balance");
    }
};

// Evento para el cambio del destinatario
const handleReceiverChange = (event) => {
    receiver = event.target.value;
    console.log(receiver);
};

// Evento para el cambio de la cantidad de SOL
const handleAmountChange = (event) => {
    amount = event.target.value;
    console.log(amount);
};

// Evento para el envío de transacción
const handleSubmit = async () => {
    console.log("Este es el receptor", receiver);
    console.log("Este es el monto", amount);
    sendTransaction();
};

const sendTransaction = async () => {
    try {
        // Consultar el balance de la wallet
        getBalances(publicKey);
        console.log("Este es el balance", balance);
        //Si el balance es menor al monto a enviar
        if (balance < amount) {
            toast.error("No tienes suficiente balance");
            return;
        }

        const provider = window?.phantom?.solana;
        const connection = new Connection(
            clusterApiUrl(SOLANA_NETWORK),
            "confirmed"
        );

        //Llaves

        const fromPubkey = new PublicKey(publicKey);
        const toPubkey = new PublicKey(receiver);

        //Creamos la transaccion
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey,
                toPubkey,
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );
        console.log("Esta es la transaccion", transaction);

        //Traemos el ultimo blocke de hash
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPubkey;

        //Firmamos la transaccion
        const transactionsignature = await provider.signTransaction(
            transaction
        );

        //Enviamos la transaccion
        const txid = await connection.sendRawTransaction(
            transactionsignature.serialize()
        );
        console.info(`Transaccion con numero de id ${txid} enviada`);

        //Esperamos a que se confirme la transaccion
        const confirmation = await connection.confirmTransaction(txid, {
            commitment: "singleGossip",
        });

        const { slot } = confirmation.value;

        console.info(
            `Transaccion con numero de id ${txid} confirmado en el bloque ${slot}`
        );

        const solanaExplorerLink = `https://explorer.solana.com/tx/${txid}?cluster=${SOLANA_NETWORK}`;
        setExplorerLink(solanaExplorerLink);

        toast.success("Transaccion enviada con exito :D ");

        //Actualizamos el balance
        getBalances(publicKey);
        setAmount(null);
        setReceiver(null);

        return solanaExplorerLink;
    } catch (error) {
        console.error("ERROR SEND TRANSACTION", error);
        toast.error("Error al enviar la transacción");
    }
};


// Función para ir al menu
document.getElementById("Menu").addEventListener("click", function () {
    window.location.href = "menu.html";
});