import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.UriInfo;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import jakarta.ws.rs.core.Response;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.mongodb.*;
import org.bson.BsonDocument;
import org.bson.BsonInt64;
import org.bson.Document;
import org.bson.conversions.Bson;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import java.lang.reflect.Array;
import java.util.Arrays;
import org.w3c.dom.TypeInfo;
import static com.mongodb.client.model.Filters.eq;
import com.mongodb.client.model.Filters;



@Path("/ei")
public class EI {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getData(@QueryParam("type") String type, @QueryParam("state") String state, @QueryParam("election") String election, @Context UriInfo uriInfo) {
        ConnectionString connectionString = new ConnectionString("mongodb://localhost:27017");
        MongoClient client = MongoClients.create(connectionString);
        MongoDatabase database = client.getDatabase("CSE416");
        MongoCollection<Document> eiCollection = database.getCollection("ei");
        Document eiData = new Document();
        Bson filterA = Filters.and(
            Filters.eq("state", "alabama"),
            Filters.eq("type", type),
            Filters.eq("election", election)
        );
        Bson filterB = Filters.and(
                Filters.eq("state", "mass"),
                Filters.eq("type", type),
                Filters.eq("election", election)
        );
        if(state.compareTo("Alabama") == 0) {
            eiData = eiCollection.find(filterA).first();
        }
        else eiData = eiCollection.find(filterB).first();
        Gson gson = new Gson();
        String json = gson.toJson(eiData);
        
        return Response.ok(json)
                .header("Access-Control-Allow-Origin", "http://localhost:3000")
                .header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .build();
    }
}

