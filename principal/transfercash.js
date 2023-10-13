import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    Connection,
    SystemProgram,
    Transaction,
    PublicKey,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
} from "@solana/web3.js";

const SOLANA_NETWORK = "devnet";

const Home = () => {
    const [publicKey, setPublicKey] = useState(null);
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [receiver, setReceiver] = useState(null);
    const [amount, setAmount] = useState(null);
    const [explorerLink, setExplorerLink] = useState(null);

    const [url, setUrl] = useState(null);

    useEffect(() => {
        let key = window.localStorage.getItem("publicKey"); //obtiene la publicKey del localStorage
        setPublicKey(key);
        if (key) getBalances(key);
        if (explorerLink) setExplorerLink(null);
    }, []);

    const handleReceiverChange = (event) => {
        setReceiver(event.target.value);
    };

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleSubmit = async () => {
        console.log("Este es el receptor", receiver);
        console.log("Este es el monto", amount);
        sendTransaction();
    };

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
        console.log("Si se esta seteando la URL", url);
    };

let receiverValue; // Declarar la variable receiverValue
let amountValue;  // Declarar la variable amountValue

// Función para volver atrás
document.getElementById("Menu").addEventListener("click", function () {
    // Aquí puedes agregar la lógica para volver atrás, por ejemplo, redirigir a la página anterior
    window.location.href = "menu.html";
});

// Función que se ejecutará al cargar la página
document.addEventListener("DOMContentLoaded", function () {
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
});

// Función para mostrar el valor en el elemento HTML
function mostrarValorEnHTML(valor) {
    const resultadoElement = document.getElementById("amount_actual");
    resultadoElement.textContent = valor;
}


document.addEventListener("DOMContentLoaded", function () {
    const receiverInput = document.getElementById("receiver");

    receiverInput.addEventListener("change", function () {
        receiverValue = receiverInput.value; // Asignar el valor a receiverValue
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const amountInput = document.getElementById("quantity_sol");

    amountInput.addEventListener("change", function () {
        amountValue = amountInput.value; // Asignar el valor a amountValue
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById("button_send");

    sendButton.addEventListener("click", function () {
        const sendTransaction = async () => {
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
    });
});
}