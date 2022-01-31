import { useEffect, useState} from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import {
    nftAddress, nftMarketAddress
} from "../config";

import NFT from "/artifacts/contracts/NFT.sol/NFT.json";
import ESMarket from "/artifacts/contracts/ESMarket.sol/ESMarket.json";
import { ethers } from "ethers";


export default function Home() {
    const [nfts, setNFTs] = useState([]);
    const [loadingState, setLoadingState] = useState("not-loaded");

    useEffect(() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {
        // provider, tokenCOntract, marketContract, data for out marketItems

        // const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/0095c162fff84a3eb7540a929ed0dfa1");
        // const provider = new ethers.providers.JsonRpcProvider("https://ropsten.infura.io/v3/0095c162fff84a3eb7540a929ed0dfa1");
        const provider = new ethers.providers.JsonRpcProvider("");
        const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
        const marketContract = new ethers.Contract(nftMarketAddress, ESMarket.abi, provider);
        const data = await marketContract.fetchMarketTokens();

        const items = await Promise.all(data.map(async i => {
            const tokenURI = await tokenContract.tokenURI(i.tokenId);

            const meta = await axios.get(tokenURI);
            let price = ethers.utils.formatUnits(i.price.toString(), "ether");
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
                name: meta.data.name,
                description: meta.data.description,
            }
            return item;
        }))

        setNFTs(items)
        setLoadingState("loaded")
    }

    async function buyNFT(nft) {
        console.log(nft)
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner();
        const contract = new ethers.Contract(nftMarketAddress, ESMarket.abi, signer)

        const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
        console.log(nft, nft.tokenId, price)
        const transaction = await contract.createMarketSale(nftAddress, nft.tokenId, {
            value: price
        });

        await transaction.wait();
        loadNFTs();
    }

    if(loadingState == "loaded" && !nfts.length) return (<h1>No NFTs</h1>)
    console.log(nfts)
    return (
        <div >
            {
                nfts.map((nft, i) => 
                    <div key={i}>
                        <img src={nft.image} />
                        <div>
                           Nmae: {nft.name}
                        </div>
                        <div>
                           Description: {nft.description}
                        </div>
                        <div>
                           Price: {nft.price}
                        </div>
                        <div>
                            <button onClick={() => buyNFT(nft)}>
                                Buy
                            </button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
