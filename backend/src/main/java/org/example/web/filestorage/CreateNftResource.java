package org.example.web.filestorage;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.jersey.multipart.FormDataParam;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.Date;
import java.util.UUID;

@Path("/create-nfts")
public class CreateNftResource {
    private static final FileStorageService fileStorageService = FileStorageService.getInstance();
    private static final String NFT_EXTENSION = ".png";
    private static final ObjectMapper mapper = new ObjectMapper();
    private static final String DOWNLOAD_LINK = "http://localhost:8000/files?fileName=";


    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response upload(@FormDataParam("file") File file) {
        try {
            if (file == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("No file uploaded").build();
            }

            BufferedImage input = ImageIO.read(file);
            File outputFile = new File(UUID.randomUUID().toString() + NFT_EXTENSION);
            ImageIO.write(input, "PNG", outputFile);

            NftImageData imageData = new NftImageData(file.getName() + NFT_EXTENSION);

            String json = mapper.writeValueAsString(imageData);
            String jsonFilename = UUID.randomUUID() + ".json";

            BufferedWriter writer = new BufferedWriter(new FileWriter("uploads/" + jsonFilename));
            writer.write(json);
            writer.close();
            return Response.ok("{\"url\": "+ "\" " + DOWNLOAD_LINK + jsonFilename + "\"\n}").build();

        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

    public static class NftImageData{
        private String image;

        public NftImageData(){}

        public NftImageData(String image) {
            this.image = "http://localhost:8000/files?fileName="
                    + image;
        }

        public String getImage() {
            return image;
        }
        public void setImage(String image) {
            this.image = image;
        }
    }
}
