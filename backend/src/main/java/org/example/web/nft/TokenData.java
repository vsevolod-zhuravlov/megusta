package org.example.web.nft;

public class TokenData {
    private String tokenID;
    private String tokenAddress;
    private String tokenURI;

    public TokenData() {}

    public TokenData(String tokenID, String tokenAddress, String tokenURI) {
        this.tokenID = tokenID;
        this.tokenAddress = tokenAddress;
        this.tokenURI = tokenURI;
    }

    public String getTokenID() {
        return tokenID;
    }

    public void setTokenID(String tokenID) {
        this.tokenID = tokenID;
    }

    public String getTokenAddress() {
        return tokenAddress;
    }

    public void setTokenAddress(String tokenAddress) {
        this.tokenAddress = tokenAddress;
    }

    public String getTokenURI() {
        return tokenURI;
    }

    public void setTokenURI(String tokenURI) {
        this.tokenURI = tokenURI;
    }

    @Override
    public String toString() {
        return "tokenId: " + tokenID + ", tokenAddress: " + tokenAddress + ", tokenURI: " + tokenURI;
    }
}