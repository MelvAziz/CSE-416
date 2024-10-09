import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/data")
public class MyResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getData() {
        String json = "{\"message\": \"Hello from JAX-RS Resource!\"}";

        // Return the response with CORS headers
        return Response.ok(json)
                .header("Access-Control-Allow-Origin", "http://localhost:3000")
                .header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .build();
    }
}
