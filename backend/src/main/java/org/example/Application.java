package org.example;

import org.example.web.JettyServer;

import java.io.IOException;

public class Application {
    private JettyServer httpServer;

    public Application() {
        httpServer = new JettyServer();
    }

    public void start() throws Exception {
        httpServer.start();
    }

    public static void main(String[] args) {


        try {
            Application application = new Application();
            application.start();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
