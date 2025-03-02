package org.example.web.filestorage;

import com.sun.jersey.multipart.FormDataParam;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.File;
import java.io.IOException;


@Path("/files")
@Consumes(MediaType.MULTIPART_FORM_DATA)
public class FileResource {
    private static final FileStorageService fileStorageService = FileStorageService.getInstance();

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response upload(@FormDataParam("file") File file,
                           @QueryParam("fileExtension") String fileExtension) {
        try {
            if (file == null) {
                return Response.status(Response.Status.BAD_REQUEST).entity("No file uploaded").build();
            }

            fileStorageService.saveFile(file, fileExtension);

            return Response.ok(new FileResourceResponse(file.getName() + fileExtension)).build();

        } catch (IOException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
        }
    }

    @GET
    @Produces(MediaType.MULTIPART_FORM_DATA)
    public Response download(@QueryParam("fileName") String fileName) throws IOException {

            File file = fileStorageService.downloadFile(fileName);


            return Response.ok(file)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .build();
    }

    public static class FileResourceResponse {
        private String fileName;

        public FileResourceResponse() {
        }

        public FileResourceResponse(String fileName) {
            this.fileName = fileName;
        }

        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }
    }
}
