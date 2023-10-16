// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
 
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//https://orange-absolute-barracuda-733.mypinata.cloud/ipfs/Qma34JYoFDhwy4B3nMqodPUhhXzTt2xgeQ6FRXRwhdqTee/1.json

contract NFTMarketplace is  ERC721URIStorage,   IERC2981 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string public baseTokenURI;
    uint256 public royaltyPercentage = 10; // 100 represents 1%, you can adjust this
    address contractOwner;
    struct NFT {
        address creator;
        uint256 price;
    }

    mapping (address => mapping( uint => bool)) isSell;
    mapping (address => mapping( uint => bool)) isSold;
    mapping(uint256 => NFT) public nfts;

    constructor( ) ERC721("My Nft", "MNFT")  
    {
       contractOwner= msg.sender;
    }


    function setBaseURI(string memory newBaseTokenURI) public   {
        baseTokenURI = newBaseTokenURI;
    }

    function mintNFT(string memory tokenURI, uint price) public {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
         nfts[tokenId]= NFT(msg.sender, price);
        isSold [msg.sender][tokenId]=false;
       _tokenIdCounter.increment();

    }

    function SellNft(uint tokenId) public  {
        require(msg.sender == ownerOf(tokenId), "Your are Authorize to sell");
        isSell[msg.sender][tokenId]=true;
    }

    function SoldNft (uint tokenids) public view returns (bool) {
        address ads= ownerOf(tokenids);
        return isSold[ads][tokenids];
    }

    function isSellNft (uint tokenid) public view returns (bool) {
        address ad = ownerOf(tokenid);
        return isSell[ad][tokenid];
    }

    function KnowPrice( uint tokenIds) public view returns (uint) {

        NFT memory info = nfts[tokenIds];
        return info.price;

    }

    function getBalance(address ads) public view returns (uint256) {
        
      return ads.balance;
    }

    function getTotalToken() public view returns(uint){
        return _tokenIdCounter.current();
    }

    function BuyNFT(uint256 tokenId) public payable  {
        
        address tokenOwner = ownerOf(tokenId);
        require(isSell[tokenOwner][tokenId]== true, "Token is not at sale");

        address buyer = msg.sender;
        uint256 price = nfts[tokenId].price;
        require(tokenOwner != buyer, "Cannot buy your own NFT");
        require(msg.value == price, "Supply Exact fund");

        // Transfer the NFT to the buyer
        _transfer(tokenOwner, buyer, tokenId);

        // Pay royalties to the contract creator
        uint256 royalties = (price * royaltyPercentage) / 100; // Calculate royalties
        payable(contractOwner).transfer(royalties); // Pay the royalties to the creator

        // Pay the seller the remaining amount
        payable(tokenOwner).transfer(price - royalties);

    }

    function royaltyInfo(uint256 tokenId, uint256 value) external view override returns (address receiver, uint256 royaltyAmount) {
        uint256 royalties = (value * royaltyPercentage) / 100;
        return (contractOwner, royalties); // Marketplace owner receives royalties
    }
}
