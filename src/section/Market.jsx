import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Axios from "axios"; // You may need to install this package
import Layout from "../component/Layout";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import "../index.css";
import Skeleton from 'react-loading-skeleton';

function Market() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [marketplaceNFTs, setMarketplaceNFTs] = useState([]);
  const [NftContract, setNftContract] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const contractAddress= '0xB8B563296c910B300E213571272079e8480a5B1e';
  const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721IncorrectOwner","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721InsufficientApproval","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC721InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"ERC721InvalidOperator","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"ERC721InvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC721InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC721InvalidSender","type":"error"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ERC721NonexistentToken","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_fromTokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"_toTokenId","type":"uint256"}],"name":"BatchMetadataUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"MetadataUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"BuyNFT","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenIds","type":"uint256"}],"name":"KnowPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"SellNft","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenids","type":"uint256"}],"name":"SoldNft","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseTokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"ads","type":"address"}],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"getOwnedNFTs","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenid","type":"uint256"}],"name":"isSellNft","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"tokenURI","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"}],"name":"mintNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nfts","outputs":[{"internalType":"address","name":"creator","type":"address"},{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"royaltyInfo","outputs":[{"internalType":"address","name":"receiver","type":"address"},{"internalType":"uint256","name":"royaltyAmount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"royaltyPercentage","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"newBaseTokenURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_percentage","type":"uint256"}],"name":"setRoyality","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"}];


  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );


  useEffect(() => {
    async function setupWeb3() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        try {
          const acc = await web3Instance.eth.requestAccounts();
          setAccounts(acc);
          console.log(acc);
        } catch (error) {
          console.error("Access to your Ethereum account denied.");
        }
      } else {
        console.error("Web3 not detected. Please install MetaMask.");
      }
    }

    setupWeb3();
  }, []);

  useEffect(() => {
    async function fetchMarketplaceNFTs() {
      // Assuming your contract ABI and address are properly set up
      
      const NftContract = new web3.eth.Contract(contractABI, contractAddress);
      setNftContract(NftContract);

      const tokenCount = await NftContract.methods.getTotalToken().call();
      const nfts = [];
    

      for (let i = 0; i < tokenCount; i++) {
        const tokenId = i;
        const owner = await NftContract.methods.ownerOf(tokenId).call();
        const tokenURI = await NftContract.methods.tokenURI(tokenId).call();

        const isTokenForSale = await NftContract.methods.isSellNft(tokenId).call();
        //console.log(owner,typeof owner, accounts , typeof accounts);
        const isOwner = owner  ;

        // Fetch NFT metadata from the tokenURI
        const metadataResponse = await Axios.get(tokenURI);
        const { image, price, name } = metadataResponse.data;

       nfts.push({ tokenId, owner, tokenURI, image, price, name, isTokenForSale, isOwner });
      }
      console.log(nfts);

      setMarketplaceNFTs(nfts);
      setIsLoading(false);
    }

    if (web3) {
      fetchMarketplaceNFTs();
    }
  },  [web3]);

  const buyNFT = async (tokenId, price) => {
    if (!web3) {
      toast.error('Web3 not connected');
      return;
    }
  
    try {
      const gas = 500000; // Adjust based on your contract
      const value = price;
      console.log(value , typeof(value));
  
      const tokenOwner = await NftContract.methods.ownerOf(tokenId).call();
      const isTokenForSale = await NftContract.methods.isSellNft(tokenId).call();
      const buyer = accounts[0];
      console.log(accounts[0], accounts);
      
          if ( buyer === tokenOwner) {
            toast.error("You can't buy your own NFT");
            return;
          }
  
      if (!isTokenForSale) {
        toast.error('Token is not for sale');
        return;
      }

      // Call the BuyNFT function
      const txdata= await NftContract.methods.BuyNFT(tokenId).encodeABI();

     const tx= {
      from: buyer ,
      to: contractAddress,
       data: txdata,
        gas,
        value,
      };
      console.log(tx);
   const receipts= await web3.eth.sendTransaction(tx).on('transactionHash', (hash)=> {
        console.log(`hash is ${hash}`);
        toast.success(`NFT Buy successfully! ${hash}`);

      })

      .on('confirmation', (confirmationNumber, receipt) => {
        // Transaction confirmed
        console.log(`Confirmation number: ${confirmationNumber}`);
        console.log('Transaction receipt:', receipt);
      })
     
    } catch (error) {
      toast.error('Error while buying NFT');
      console.error(error);
    }
  };

  const sellNFT = async (tokenId) => {
    try {
      if (!web3 || !NftContract) {
        toast.error('Web3 or contract not available');
        return;
      }

      const gas = 500000; // Adjust based on your contract
      const seller = accounts[0];

      const isOwner = marketplaceNFTs.find((nft) => nft.tokenId === tokenId && nft.isOwner);

      if (!isOwner) {
        toast.error("You can only sell your own NFT");
        return;
      }
      const processingMessageId = toast.info('Processing your transaction...');

      // Call the sellNft function
      const txdata = await NftContract.methods.SellNft(tokenId).encodeABI();

      const tx = {
        from: seller,
        to: contractAddress,
        data: txdata,
        gas,
      };

     const recpt= await web3.eth.sendTransaction(tx)
        .on('transactionHash', (hash) => {
          toast.dismiss(processingMessageId);
          toast.success('Transaction submitted: ' + hash);
          console.log(`hash is ${hash}`);
        })
        .on('confirmation', (confirmationNumber,  receipt) => {
          console.log(`Confirmation number: ${confirmationNumber}`);
          console.log('Transaction receipt:', tx.receipt);
        });

    } catch (error) {
      toast.error('Error while putting NFT up for sale');
      console.error(error);
    }
  };
  return (
    <Layout>
      <div className="mt-10">
        <h1>NFT Market</h1>
        {isLoading ? (
         <LoadingSpinner /> 
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 pt-5">
          {marketplaceNFTs.map((nft) => (
            <Card key={nft.tokenId}>
              <CardMedia
                component="img"
                alt="NFT"
                height="200"
                image={nft.image}
              />
              <CardContent className="text-center">
                <h2 className="text-lg font-semibold">Name: {nft.name}</h2>
                <p>Price: {nft.price} WEI</p>
                {nft.isTokenForSale ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => buyNFT(nft.tokenId, nft.price)}
                  >
                    Buy
                  </Button>
                ) : (
                 
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => sellNFT(nft.tokenId)}
                    >
                      Sell
                    </Button>
                  )
                 }
              </CardContent>
            </Card>
          ))}
        </div>
        )}
      </div>
    </Layout>
  );
}

export default Market;
