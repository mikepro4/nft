import { useState} from "react";
import Web3Modal from "web3modal";

import {
    nftAddress, nftMarketAddress
} from "../config";

import NFT from "/artifacts/contracts/NFT.sol/NFT.json";
import ESMarket from "/artifacts/contracts/ESMarket.sol/ESMarket.json";
import { ethers } from "ethers";

import { create as ipfsHttpClient} from "ipfs-http-client";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { useRouter} from "next/router";

export default function MintItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({
        price: "",
        name: "",
        description: ""
    })

    const router = useRouter()
    async function onChange(e) {
        const file = e.target.files[0];
        try {
            const added = await client.add(
                file, {
                    progress: (prog) => console.log("received: ", prog)
                }
            )
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            setFileUrl(url);
        } catch(error) {
            console.log("error: ", error);
        }
    }

    async function createMarket() {
        const {name, description, price} = formInput;
        if(!name || !description || !price || !fileUrl) return 
        
        const data = JSON.stringify({
            name, description, image: fileUrl
        })

        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`;

            // run create sell and pass url
            createSale(url);
        } catch(error) {
            console.log("error: ", error);
        }
    }

    async function createSale(url) {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let contract = new ethers.Contract(nftAddress, NFT.abi, signer)
        let transaction = await contract.mintToken(url)
        let tx = await transaction.wait()
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
        const price = ethers.utils.parseUnits(formInput.price, "ether");

        // list the item for sale

        contract = new ethers.Contract(nftMarketAddress, ESMarket.abi, signer);
        let listingPrice = await contract.getListingPrice()
        listingPrice = listingPrice.toString()

        transaction = await contract.makeMarketItem(
            nftAddress,
            tokenId,
            price,
            {
                value: listingPrice
            }
        )

        await transaction.wait()

        router.push("./")
    }

    return (
        <div>

            <div>
                <input
                    placeholder="Asset name"
                    onChange={e => updateFormInput({...formInput, name: e.target.value})}
                />
                <textarea
                    placeholder="Asset Description"
                    onChange={e => updateFormInput({...formInput, description: e.target.value})}
                />
                <input
                    placeholder="Asset price"
                    onChange={e => updateFormInput({...formInput, price: e.target.value})}
                />
                <input
                    type="file"
                    name="Asset"
                    onChange={onChange}
                />
                {fileUrl && <img src={fileUrl}></img>}

                <button onClick={createMarket}>
                    Mint NFT
                </button>
            </div>


        </div>
    )

}