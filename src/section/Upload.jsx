import { useState } from 'react';
import { ethers } from 'ethers';
import { Container, TextField, TextareaAutosize, Button } from '@mui/material';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from "../component/Layout";
import axios from 'axios'; 

const client = ipfsHttpClient('https://api.pinata.cloud/pinning/pinataipfs');
const key="49ee4a00bfc33ea5df71";
const secretkey= "4158240fa73f2ae3dddc47ee3ad3adc3eaaa27cece3423ccaae1e57b7ce9355b";

const Upload = ({ marketplace, nft }) => {
    const [image, setImage] = useState('');
    const [price, setPrice] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
  
    const uploadToIPFS = async (event) => {
      event.preventDefault();
      const file = event.target.files[0];
      if (typeof file !== 'undefined') {
        try {
          const result = await client.add(file);
          console.log(result);
          setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
        } catch (error) {
          console.error("IPFS image upload error: ", error);
          toast.error("IPFS image upload error: " + error.message);
        }
      }
    };
  
    const createNFT = async () => {
      if (!image || !price || !name || !description) {
        toast.error("Please fill out all fields.");
        return;
      }
      try {
        const result = await client.add(JSON.stringify({ image, price, name, description }));
        mintThenList(result);
      } catch (error) {
        console.error("IPFS URI upload error: ", error);
        toast.error("IPFS URI upload error: " + error.message);
      }
    };
  
    // const mintThenList = async (result) => {
    //   const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
    //   // mint NFT
    //   await (await nft.mint(uri)).wait();
    //   // get tokenId of new NFT
    //   const id = await nft.tokenCount();
    //   // approve marketplace to spend NFT
    //   await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    //   // add NFT to the marketplace
    //   const listingPrice = ethers.utils.parseEther(price.toString());
    //   await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
    //   toast.success("NFT created and listed successfully.");
    // };
  
    return (
        <Layout>
      <Container maxWidth="sm" style={{ marginTop: '20px' }}>
        <div className="content mx-auto">
          <form>
            <input
              type="file"
              required
              name="file"
              onChange={uploadToIPFS}
            />
            <TextField
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              label="Name"
            />
            <TextareaAutosize
              onChange={(e) => setDescription(e.target.value)}
              minRows={3}
              fullWidth
              required
              placeholder="Description"
            />
            <TextField
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
              required
              type="number"
              label="Price in ETH"
            />
            <div className="d-grid px-0">
              <Button onClick={createNFT} variant="contained" color="primary" size="large">
                Create & List NFT!
              </Button>
            </div>
          </form>
        </div>
      </Container>
      </Layout>
    );
  };

  export default Upload;