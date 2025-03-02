package org.example.web;

import org.glassfish.jersey.jackson.JacksonFeature;

import jakarta.ws.rs.ApplicationPath;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;

@ApplicationPath("/api")
public class JettyServerResourceConfig extends ResourceConfig {

    public JettyServerResourceConfig() {
        packages("org.example.web");
        register(RolesAllowedDynamicFeature.class);
        register(JacksonFeature.class);
    }
}
