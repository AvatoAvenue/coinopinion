window.toast = require("react-hot-toast").default;
window.Toaster = require("react-hot-toast").Toaster;
window.React = require("react");
window.useState = require("react").useState;
window.useEffect = require("react").useEffect;
window.useRouter = require("next/router").useRouter;
window.Connection = require("@solana/web3.js").Connection;
window.SystemProgram = require("@solana/web3.js").SystemProgram;
window.Transaction = require("@solana/web3.js").Transaction;
window.PublicKey = require("@solana/web3.js").PublicKey;
window.LAMPORTS_PER_SOL = require("@solana/web3.js").LAMPORTS_PER_SOL;
window.clusterApiUrl = require("@solana/web3.js").clusterApiUrl;
window.SendTransactionError = require("@solana/web3.js").SendTransactionError;

const SOLANA_NETWORK = "devnet";

window.Home = () => {
    const [publicKey, setPublicKey] = useState(null);
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [receiver, setReceiver] = useState(null);
    const [amount, setAmount] = useState(null);
    const [explorerLink, setExplorerLink] = useState(null);

    const [uploadUrl, setUploadUrl] = useState(null);
    const [url, setUrl] = useState(null);
    const [statusText, setStatusText] = useState("");

    useEffect(() => {
        let key = window.localStorage.getItem("publicKey"); //obtiene la publicKey del localStorage
        setPublicKey(key);
        if (key) getBalances(key);
        if (explorerLink) setExplorerLink(null);
    }, []);

    window.handleReceiverChange = (event) => {
        setReceiver(event.target.value);
        console.log(event.target.value);
    };

    window.handleAmountChange = (event) => {
        setAmount(event.target.value);
        console.log(event.target.value);
    };

    window.handleSubmit = async () => {
        console.log("Este es el receptor", receiver);
        console.log("Este es el monto", amount);
        sendTransaction();
    };

    window.handleUrlChange = (event) => {
        setUrl(event.target.value);
        console.log("Si se esta seteando la URL", url);
    };

    //Funcion para obtener el balance de nuestra wallet

    window.getBalances = async (publicKey) => {
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

    //Funcion para enviar una transaccion
    window.sendTransaction = async () => {
        try {
            //Consultar el balance de la wallet
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
                
                console.log(balance);
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
            toast.error("Error al enviar la transaccion");
        }
    };

    return (
        <div className="h-screen bg-black">
            <div className="flex flex-col  w-auto h-auto  bg-black">
                <div className="flex flex-col py-24 place-items-center justify-center">
                    <h1 className="text-5xl font-bold pb-10 text-emerald-300">
                        Superteach Starter
                    </h1>

                    {publicKey ? (
                        <div className="flex flex-col py-24 place-items-center justify-center">
                            <br />

                            <h1 className="text-2xl font-bold text-white">
                                Tu numero de Wallet es {publicKey}
                            </h1>

                            <br />

                            <h1 className="text-2xl font-bold text-white">
                                Tu balance es {balance} SOL
                            </h1>
                            <br />
                            <h1 className="text-2xl  text-white">
                                Enviar una transaccion a:
                            </h1>

                            <input
                                className="h-8 w-72 mt-4   border-2 border-black "
                                type="text"
                                onChange={handleReceiverChange}
                            />
                            <br />
                            <h1 className="text-2xl  text-white">
                                Cantidad de SOL a enviar:
                            </h1>
                            <input
                                className="h-8 w-72 mt-4   border-2 border-black "
                                type="text"
                                onChange={handleAmountChange}
                            />
                            <br />
                            <button
                                type="submit"
                                className="inline-flex h-8 w-52 justify-center bg-purple-500 font-bold text-white"
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                Enviar 
                            </button>
                            <br />

                            <p className="text-white font-bold mb-8">
                                {statusText}
                            </p>

                            <br />

                        </div>
                    ) : (
                        <div className="flex flex-col place-items-center justify-center">
                            <button
                                type="submit"
                                className="inline-flex h-8 w-52 justify-center bg-purple-500 font-bold text-white"
                                onClick={() => {
                                    signIn();
                                }}
                            >
                                Conecta tu wallet 👻
                            </button>
                        </div>
                    )}
                </div>
                <Toaster position="bottom-center" />
            </div>
        </div>
    );
};

export default Home;
