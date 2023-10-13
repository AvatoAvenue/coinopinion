import toast, { Toaster } from "react-hot-toast";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
    Connection,
    SystemProgram,
    Transaction,
    PublicKey,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
    SendTransactionError,
} from "@solana/web3.js";
import { useStorageUpload } from "@thirdweb-dev/react";

import axios from "axios";

const SOLANA_NETWORK = "devnet";
const web3 = require('@solana/web3.js');
const connection = new web3.Connection(web3.clusterApiUrl('devnet')); // Change 'devnet' to the desired network
const publicKey = web3.PublicKey.default;

const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: publicKey, // Sender's public key
      toPubkey: 'RECIPIENT_PUBLIC_KEY', // Recipient's public key
      lamports: 1000000, // Amount to send in lamports
    })
  );
  
  // Sign the transaction using Phantom wallet
  web3.sendAndConfirmTransaction(connection, transaction, [publicKey])
    .then((signature) => {
      console.log('Transaction confirmed with signature:', signature);
    })
    .catch((error) => {
      console.error('Transaction failed:', error);
    });
  

const Home = () => {
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

        toast.success("Tu Wallet esta conectada 👻");

        getBalances(publicKey);
    };

    //Funcion para cerrar sesion con nuestra Wallet de Phantom

    const signOut = async () => {
        if (window) {
            const { solana } = window;
            window.localStorage.removeItem("publicKey");
            setPublicKey(null);
            solana.disconnect();
            router.reload(window?.location?.pathname);
        }
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

    //Funcion para enviar una transaccion
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

    //Función para subir archivos a IPFS

    const { mutateAsync: upload } = useStorageUpload();

    const uploadToIpfs = async (file) => {
        setStatusText("Subiendo a IPFS...");
        const uploadUrl = await upload({
            data: [file],
            options: {
                uploadWithGatewayUrl: true,
                uploadWithoutDirectory: true,
            },
        });
        return uploadUrl[0];
    };

    // URL a Blob
    const urlToBLob = async (file) => {
        setStatusText("Transformando url...");
        await fetch(url)
            .then((res) => res.blob())
            .then((myBlob) => {
                // logs: Blob { size: 1024, type: "image/jpeg" }

                myBlob.name = "blob.png";

                file = new File([myBlob], "image.png", {
                    type: myBlob.type,
                });
            });

        const uploadUrl = await uploadToIpfs(file);
        console.log("uploadUrl", uploadUrl);

        setStatusText(`La url de tu archivo es: ${uploadUrl} `);
        setUploadUrl(uploadUrl);

        return uploadUrl;
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
                                Enviar ⚡
                            </button>
                            <br />

                            <a href={explorerLink}>
                                <h1 className="text-md font-bold text-sky-500">
                                    {explorerLink}
                                </h1>
                            </a>
                            <br />

                            <h1 className="text-2xl  text-white">
                                Url del archivo que quieres subir:
                            </h1>

                            <input
                                className="h-8 w-52 mt-4 border-2 border-black"
                                type="float"
                                onChange={handleUrlChange}
                            />
                            <br />
                            <button
                                className="inline-flex h-8 w-52 justify-center bg-purple-500 font-bold text-white"
                                onClick={() => {
                                    urlToBLob();
                                }}
                            >
                                Subir archivo a IPFS
                            </button>

                            <br />

                            <p className="text-white font-bold mb-8">
                                {statusText}
                            </p>

                            <br />

                            {uploadUrl ? (
                                <button
                                    className="inline-flex h-8 w-52 justify-center bg-purple-500 font-bold text-white"
                                    onClick={() => {
                                        generateNFT();
                                    }}
                                >
                                    Crear NFT 🔥
                                </button>
                            ) : (
                                <button
                                    className="inline-flex h-8 w-auto justify-center bg-red-500 font-bold text-white"
                                    onClick={() => {
                                        toast.error(
                                            "Primero sube una imagen a IPFS"
                                        );
                                    }}
                                >
                                    Primer sube una imagen a IPFS ⚠
                                </button>
                            )}

                            <br />
                            <button
                                type="submit"
                                className="inline-flex h-8 w-52 justify-center bg-purple-500 font-bold text-white"
                                onClick={() => {
                                    signOut();
                                }}
                            >
                                Desconecta tu wallet 👻
                            </button>
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
