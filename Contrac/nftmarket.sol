// SPDX-License-Identifier: MIT
//@title NFTMarketplace
//@Auther Anurag Sahu

pragma solidity ^0.8.18;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//https://orange-absolute-barracuda-733.mypinata.cloud/ipfs/Qma34JYoFDhwy4B3nMqodPUhhXzTt2xgeQ6FRXRwhdqTee/1.json

contract NFTMarketplace is ERC721URIStorage, IERC2981 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string public baseTokenURI;
    uint256 public royaltyPercentage = 10;
    address immutable contractOwner;
    struct NFT {
        address creator;
        uint256 price;
    }

    mapping(address => mapping(uint256 => bool)) isSell;
    mapping(address => mapping(uint256 => bool)) isSold;
    mapping(uint256 => NFT) public nfts;

    constructor() ERC721("My Nft", "MNFT") {
        contractOwner = msg.sender;
    }

    function setBaseURI(string memory newBaseTokenURI) public {
        baseTokenURI = newBaseTokenURI;
    }

    function mintNFT(string memory tokenURI, uint256 price) public {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        nfts[tokenId] = NFT(msg.sender, price);
        isSold[msg.sender][tokenId] = false;
        _tokenIdCounter.increment();
    }

    function SellNft(uint256 tokenId) public {
        require(msg.sender == ownerOf(tokenId), "Your are Authorize to sell");
        isSell[msg.sender][tokenId] = true;
        approve(address(this), tokenId);
    }

    function SoldNft(uint256 tokenids) public view returns (bool) {
        address ads = ownerOf(tokenids);
        return isSold[ads][tokenids];
    }

    function isSellNft(uint256 tokenid) public view returns (bool) {
        address ad = ownerOf(tokenid);
        return isSell[ad][tokenid];
    }

    function KnowPrice(uint256 tokenIds) public view returns (uint256) {
        NFT memory info = nfts[tokenIds];
        return info.price;
    }

    function getBalance(address ads) public view returns (uint256) {
        return ads.balance;
    }

    function getTotalToken() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function BuyNFT(uint256 tokenId) public payable {
        address tokenOwner = ownerOf(tokenId);

        // Check if the NFT is for sale
        require(isSell[tokenOwner][tokenId] == true, "Token is not for sale");

        address payable buyer = payable(msg.sender);
        uint256 price = nfts[tokenId].price;

        // Check that the buyer is not the owner
        require(tokenOwner != buyer, "Cannot buy your own NFT");

        // Check if the sent value is greater than or equal to the NFT price
        require(msg.value >= price, "Insufficient payment");

        // Transfer the NFT to the buyer
        _transfer(tokenOwner, buyer, tokenId);

        // Calculate and pay royalties to the contract creator
        uint256 royalties = (price * royaltyPercentage) / 100;
        address payable creator = payable(contractOwner);
        creator.transfer(royalties);

        address payable towner = payable(tokenOwner);
        // Pay the seller the remaining amount
        towner.transfer(price - royalties);
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function getOwnedNFTs(address owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory ownedNFTs = new uint256[](balanceOf(owner));
        uint256 tokenCount = totalSupply();
        uint256 ownedNFTsCount = 0;

        for (uint256 i = 0; i < tokenCount; i++) {
            if (ownerOf(i) == owner) {
                ownedNFTs[ownedNFTsCount] = i;
                ownedNFTsCount++;
            }
        }

        return ownedNFTs;
    }

    function royaltyInfo(uint256 tokenId, uint256 value)
        public
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        uint256 royalties = (value * royaltyPercentage) / 100;
        return (contractOwner, royalties); // Marketplace owner receives royalties
    }

    function setRoyality(uint256 _percentage) external {
        require(msg.sender == contractOwner, "Unauthorized Access ");
        royaltyPercentage = _percentage;
    }
}
