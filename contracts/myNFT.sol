//Contract based on [https://docs.openzeppelin.com/contracts/3.x/erc721](https://docs.openzeppelin.com/contracts/3.x/erc721)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Base64} from "./libraries/Base64.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 private _tokenLimit = 500;
    string baseSVG = "<svg id='svg' viewbox='0 0 500 500' width='500'> <image width='500' href='https://cloudflare-ipfs.com/ipfs/bafkreihy3vlh4dkaokxnncywfnapn643mbbltl37l45dzgzmywgbrhg4ie/'/> <text x='356' y='475' style='position:absolute; fill: white; font-family:Montserrat; font-weight: bold; font-size: 22px;'>";

    constructor() ERC721("MyNFT", "NFT") {}

    function mintNFT(address recipient) public 
      returns(uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        if (newItemId < _tokenLimit) {

          string memory svgData = Base64.encode(abi.encodePacked(baseSVG, Strings.toString(newItemId), " of 500</text></svg>"));
          if (newItemId > 10) {
            svgData = Base64.encode(abi.encodePacked(baseSVG, "0", Strings.toString(newItemId), " of 500</text></svg>"));
          } else {
            svgData = Base64.encode(abi.encodePacked(baseSVG, "00", Strings.toString(newItemId), " of 500</text></svg>"));
          }

          string memory json = Base64.encode (
            bytes(
              string(
                abi.encodePacked(
                  "{ 'name': 'Illini Blockchain NFT Series 1', 'description': 'An NFT produced by Illini Blockchain on the Rinkeby testnet!','image': 'data:image/svg+xml;base64,",
                      svgData, "'}"
                )
              )
            )
          );
          
          string memory finalTokenUri = string(abi.encodePacked("data:application/json;base64,", json));
          console.log(newItemId);
          console.log(finalTokenUri);
          _mint(recipient, newItemId);
          _setTokenURI(newItemId, finalTokenUri);
        }
        return newItemId;
    }
}
