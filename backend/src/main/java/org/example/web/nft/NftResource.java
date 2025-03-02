package org.example.web.nft;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/get-nfts")
@Consumes(MediaType.MULTIPART_FORM_DATA)
public class NftResource {
    private static final NftService nftService = new NftService();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getNfts(@QueryParam("address") String address) {

        try {
            List<TokenData> nfts = nftService.getNftData(address);
            return Response.ok(nfts).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

}
