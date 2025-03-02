package org.example.web.nft;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;


public class NftService {
    private static final String MORALIS_API_ADDRESS = "https://deep-index.moralis.io/api/v2.2/";
    private static final String MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImJjMjEyNWE5LTk2ZDQtNDU5Zi1iMjYxLWQ4MGEwODZkZGQ1NiIsIm9yZ0lkIjoiNDM0MTA0IiwidXNlcklkIjoiNDQ2NTUxIiwidHlwZUlkIjoiN2QzYjk2NDItNGI2My00M2ExLTljYmYtMDgyODNlOTQ3ZGIzIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3NDA3NTI1MzYsImV4cCI6NDg5NjUxMjUzNn0.YULoY2FsAO9CSBYCGg7l-uBM4UEGccjPk97M7DQCpgY";
    private final HttpClient moralisClient = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    public List<TokenData> getNftData(String address) throws Exception {
        try {
            String json = callMoralisApi(address);
            return decodeMoralisJson(json);
        } catch (Exception e) {
            throw e;
        }
    }

    private String callMoralisApi(String address) throws URISyntaxException, IOException, InterruptedException {
        HttpRequest request = null;
            request = HttpRequest.newBuilder()
                    .uri(new URI(MORALIS_API_ADDRESS
                            + address
                            + "/nft?chain=sepolia&format=decimal&media_items=false"))
                    .header("accept", "application/json")
                    .header("X-API-Key", MORALIS_API_KEY)
                    .GET()
                    .build();
            HttpResponse<String> response = moralisClient.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();

    }

    private List<TokenData> decodeMoralisJson(String json) throws JsonProcessingException {
        JsonNode rootNode = mapper.readTree(json);
        JsonNode resultArray = rootNode.get("result");

        List<TokenData> extractedData = new ArrayList<>();

        for (JsonNode item : resultArray) {
            String contractType = item.get("contract_type").asText();
            if (contractType.equals("ERC721")) {
                String tokenURI = item.get("token_uri").asText();
                if (uriSupported(tokenURI)) {
                    String tokenID = item.get("token_id").asText();
                    String tokenAddress = item.get("token_address").asText();

                    extractedData.add(new TokenData(tokenID, tokenAddress, tokenURI));
                }
            }
        }

        return extractedData;
    }

    private static boolean uriSupported(String uri) {
        return uri.startsWith("https:");
    }
}
