import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;
import jakarta.ws.rs.core.Application;
import java.io.IOException;
import java.net.URI;

public class SimpleServer {
    // Define the base URI where the server will listen
    public static final String BASE_URI = "http://localhost:8000/api/";

    // Start the Grizzly server
    public static HttpServer startServer() {
        // Register your JAX-RS resource classes with the ResourceConfig
        final ResourceConfig rc = new ResourceConfig(MyResource.class);
        
        // Create and start a new Grizzly HTTP server listening at the base URI
        return GrizzlyHttpServerFactory.createHttpServer(URI.create(BASE_URI), rc);
    }

    public static void main(String[] args) throws IOException {
        // Start the Grizzly server
        final HttpServer server = startServer();
        System.out.println(String.format("Server started at %s. Press Ctrl+C to stop.", BASE_URI));

        // Keep the server running until manually stopped
        System.in.read();
        server.shutdownNow();
    }
}
