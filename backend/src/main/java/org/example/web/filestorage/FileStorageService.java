package org.example.web.filestorage;


import java.io.File;
import java.io.IOException;

public class FileStorageService {
    private static FileStorageService instance;
    private Storage storage;

    private FileStorageService() {

        storage = new LocalStorage();
    }

    public static FileStorageService getInstance() {
        if (instance == null) {
            instance = new FileStorageService();
        }
        return instance;
    }

    public void saveFile(File file, String extension) throws IOException {
        File newFile = new File(file.getParent(), file.getName() + extension);
        file.renameTo(newFile);
        storage.uploadFile(newFile);
    }

    public void saveFile(File file) throws IOException {
        storage.uploadFile(file);
    }

    public void deleteFile(String fileId) {
        storage.deleteFile(fileId);
    }

    public File downloadFile(String fileId) throws IOException {
        return storage.downloadFile(fileId);
    }

    public Storage getStorage() {
        return storage;
    }
}
