// NFTCard.js
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

const NftCard = ({ nft}) => {
  return (
    <Card>
      <CardMedia
        component="img"
        alt="NFT"
        height="200"
        image={nft.image}
      />
      <CardContent>
        <p>Price: {nft.price} ETH</p>
        <Button variant="contained" color="primary" >
          Buy
        </Button>
      </CardContent>
    </Card>
  );
};

export default NftCard;
