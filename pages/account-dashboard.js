import { useEffect, useState} from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import {
    nftAddress, nftMarketAddress
} from "../config";

import NFT from "/artifacts/contracts/NFT.sol/NFT.json";
import ESMarket from "/artifacts/contracts/ESMarket.sol/ESMarket.json";
import { ethers } from "ethers";


export default function AccountDashboard() {
    const [nfts, setNFTs] = useState([]);
    const [sold, setSold] = useState([])
    const [loadingState, setLoadingState] = useState("not-loaded");

    useEffect(() => {
        loadNFTs()
    }, [])

    async function loadNFTs() {
        // provider, tokenCOntract, marketContract, data for out marketItems
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
        const marketContract = new ethers.Contract(nftMarketAddress, ESMarket.abi, signer);
        const data = await marketContract.fetchItemsCreated();

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

        const soldItems = items.filter(i=> i.sold)
        console.log(soldItems)
        setSold(soldItems)

        setNFTs(items)
        setLoadingState("loaded")
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
                            {/* <button onClick={() => buyNFT(nft)}>
                                Buy
                            </button> */}
                        </div>
                    </div>
                )
            }
        </div>
    )
}
