import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Application;

@Path("/data")
public class MyResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public String getData() {
        return "{\"message\": \"Hello from JAX-RS Resource!\"}";
    }
}
