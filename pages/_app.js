import '../styles/globals.css'
import './app.css'

import Link from "next/link";

function ESMarketplace({ Component, pageProps}) {
    return(
        <div>
            <nav className="border-b p6" >
                <p className="text-4x1 font-bold text-white">Ethereal Shapes</p>
                <div className="flex mt-4 justify-center">
                    <Link href="/">
                        <a className="mr-4">
                            Main Marketplace
                        </a>
                    </Link>

                    <Link href="/mint-item">
                        <a className="mr-6">
                            Mint Tokens
                        </a>
                    </Link>

                    <Link href="/my-nfts">
                        <a className="mr-6">
                            MY NFTs
                        </a>
                    </Link>

                    <Link href="/account-dashboard">
                        <a className="mr-6">
                            Account Dashboard
                        </a>
                    </Link>
                </div>
            </nav>

            <Component {...pageProps} />
        </div>
    )
}

export default ESMarketplace
