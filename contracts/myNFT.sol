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
    string baseSVG = "<svg id='svg' viewbox='0 0 500 500' width='500' height='500' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'> <style> text {position: absolute;fill:white; font-family:Montserrat; font-weight:bold; font-size: 22px;}</style> <image width='500' href='data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgNTAwIj48ZGVmcz48c3R5bGU+LmNscy0xLC5jbHMtMTJ7ZmlsbDojZmZmO30uY2xzLTJ7Zm9udC1zaXplOjM4cHg7ZmlsbDojMTMyOTRiO30uY2xzLTEyLC5jbHMtMntmb250LWZhbWlseTpNb250c2VycmF0LUJvbGQsIE1vbnRzZXJyYXQ7Zm9udC13ZWlnaHQ6NzAwO30uY2xzLTN7bGV0dGVyLXNwYWNpbmc6LTAuMDFlbTt9LmNscy00e2xldHRlci1zcGFjaW5nOi0wLjAzZW07fS5jbHMtNXtmaWxsOm5vbmU7c3Ryb2tlOiMwMDA7c3Ryb2tlLXdpZHRoOjZweDt9LmNscy02e2ZpbGw6IzEwMjIzZTt9LmNscy03e2ZpbGw6IzIwNDQ3Yjt9LmNscy04e2ZpbGw6IzBkMmU2Mjt9LmNscy05e2ZpbGw6I2NkNDUzMjt9LmNscy0xMHtmaWxsOiNlODc4Njg7fS5jbHMtMTF7ZmlsbDojZTA0ZTM5O30uY2xzLTEye2ZvbnQtc2l6ZToyM3B4O30uY2xzLTEze2xldHRlci1zcGFjaW5nOi0wLjAyZW07fS5jbHMtMTR7bGV0dGVyLXNwYWNpbmc6MGVtO30uY2xzLTE1e2xldHRlci1zcGFjaW5nOi0wLjAyZW07fTwvc3R5bGU+PC9kZWZzPjxyZWN0IGNsYXNzPSJjbHMtMSIgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiLz48dGV4dCBjbGFzcz0iY2xzLTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDIyMS44NyAyNTMuOTgpIj5JTExJTkk8dHNwYW4geD0iMCIgeT0iNDUuNiI+QjwvdHNwYW4+PHRzcGFuIGNsYXNzPSJjbHMtMyIgeD0iMjkuMDciIHk9IjQ1LjYiPkw8L3RzcGFuPjx0c3BhbiB4PSI1MS41NyIgeT0iNDUuNiI+T0M8L3RzcGFuPjx0c3BhbiBjbGFzcz0iY2xzLTQiIHg9IjExMS40OSIgeT0iNDUuNiI+SzwvdHNwYW4+PHRzcGFuIHg9IjEzOC42NiIgeT0iNDUuNiI+Q0hBSU48L3RzcGFuPjwvdGV4dD48cGF0aCBjbGFzcz0iY2xzLTUiIGQ9Ik05Ny40MSwyOTdjLTEyLjM0LDU3LjU4LTQyLDY5LTU0LDc4Ii8+PHBhdGggY2xhc3M9ImNscy01IiBkPSJNMTEwLjQ0LDI3OC40OUM0OC42NiwyOTIuODYsMTYuNDIsMzIxLDgsMzMzIi8+PHBhdGggY2xhc3M9ImNscy01IiBkPSJNMjQ4LDE3NWMtNi41MywxMi44Mi0yOC42Nyw0MC44NC04MSw1M3MtOTcuOCwzOC4yOC0xMDYuNjcsNTAuNSIvPjxwYXRoIGNsYXNzPSJjbHMtNSIgZD0iTTIwMi4xNywxMzkuMTZjLTEwLjg0LDEyLjUtNDMsNjEuMTgtNTQuMjgsMTA5LjYzcy0zNy42NCw2My45Mi00OS40MSw2NS42Ii8+PHJlY3QgY2xhc3M9ImNscy02IiB4PSI1NS40OSIgeT0iMjczLjQxIiB3aWR0aD0iNTQuOTMiIGhlaWdodD0iNTQuOTMiLz48cG9seWdvbiBjbGFzcz0iY2xzLTciIHBvaW50cz0iNzAuODcgMjU3LjI5IDU1LjQ5IDI3My40MSAxMTAuNDIgMjczLjQxIDEyNS44IDI1Ny4yOSA3MC44NyAyNTcuMjkiLz48cG9seWdvbiBjbGFzcz0iY2xzLTgiIHBvaW50cz0iMTEwLjQyIDI3My40MSAxMjUuOCAyNTcuMjkgMTI1LjggMzEyLjIyIDExMC40MiAzMjguMzMgMTEwLjQyIDI3My40MSIvPjxyZWN0IGNsYXNzPSJjbHMtOSIgeD0iMTM0LjU5IiB5PSIxOTkuNDQiIHdpZHRoPSI1NC45MyIgaGVpZ2h0PSI1NC45MyIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMTAiIHBvaW50cz0iMTQ5Ljk3IDE4My4zMyAxMzQuNTkgMTk5LjQ0IDE4OS41MSAxOTkuNDQgMjA0Ljg5IDE4My4zMyAxNDkuOTcgMTgzLjMzIi8+PHBvbHlnb24gY2xhc3M9ImNscy0xMSIgcG9pbnRzPSIyMDQuODkgMjM4LjI1IDE4OS41MSAyNTQuMzcgMTg5LjUxIDE5OS40NCAyMDQuODkgMTgzLjMzIDIwNC44OSAyMzguMjUiLz48cmVjdCBjbGFzcz0iY2xzLTkiIHg9IjE4LjY1IiB5PSIxNC4wMyIgd2lkdGg9IjE0NSIgaGVpZ2h0PSI0MiIgcng9IjE1LjA1Ii8+PHRleHQgY2xhc3M9ImNscy0xMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDEuMzkgNDIuNzUpIj5SaW48dHNwYW4gY2xhc3M9ImNscy0xMyIgeD0iMzkuNzIiIHk9IjAiPms8L3RzcGFuPjx0c3BhbiBjbGFzcz0iY2xzLTE0IiB4PSI1NC4zNyIgeT0iMCI+ZTwvdHNwYW4+PHRzcGFuIGNsYXNzPSJjbHMtMTUiIHg9IjY4Ljg4IiB5PSIwIj5iPC90c3Bhbj48dHNwYW4geD0iODQuNDEiIHk9IjAiPnk8L3RzcGFuPjwvdGV4dD48cmVjdCBjbGFzcz0iY2xzLTkiIHg9IjM0MyIgeT0iNDQ3IiB3aWR0aD0iMTQ1IiBoZWlnaHQ9IjQyIiByeD0iMTUuMDUiLz48L3N2Zz4='/> <text x='356' y='475'>";
    constructor() ERC721("ILLINIv1", "Illini Blockchain Series 1") {}

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
                  '{ "name": "Illini Blockchain NFT Series 1", "description": "An NFT produced by Illini Blockchain on the Rinkeby testnet!", "image_data": "data:image/svg+xml;base64,',
                    svgData, 
                  '"}'
                )
              )
            )
          );
          
          string memory finalTokenUri = string(abi.encodePacked("data:application/json;base64,", json));

          _mint(recipient, newItemId);
          _setTokenURI(newItemId, finalTokenUri);
        }
        return newItemId;
    }
}
