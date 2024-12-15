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
import jakarta.ws.rs.core.Response;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.mongodb.*;
import static com.mongodb.client.model.Filters.eq;
import org.bson.BsonDocument;
import org.bson.BsonInt64;
import org.bson.Document;
import org.bson.conversions.Bson;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSFile;
import com.mongodb.client.model.Filters;
import org.bson.types.ObjectId;
import java.lang.reflect.Array;
import java.util.Arrays;
import org.w3c.dom.TypeInfo;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.nio.file.Files;
import java.io.IOException;
import java.nio.file.Paths;
// import javax.swing.text.Document;

@Path("/map")
public class Maps {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getData(@QueryParam("type") String type, @QueryParam("state") String state, @Context UriInfo uriInfo) {
        ConnectionString connectionString = new ConnectionString("mongodb://localhost:27017");
        MongoClient client = MongoClients.create(connectionString);
        MongoDatabase database = client.getDatabase("CSE416");
        MongoCollection<Document> mapCollection = database.getCollection("maps");
        GridFSBucket gridFSBucket = GridFSBuckets.create(database);
        Document mapReturned = new Document();
        if(type.compareTo("usa") == 0) {
            mapReturned = mapCollection.find(eq("name", "usa_map")).first();
        }
        else if(type.compareTo("congressional_districts") == 0) {
            if(state.compareTo("Alabama") == 0 ) 
                mapReturned = mapCollection.find(eq("name", "alabama_congressional_districts")).first();
            else if(state.compareTo("Massachusetts") == 0 ) 
                mapReturned = mapCollection.find(eq("name", "massachusetts_congressional_districts")).first();
        }
        else if(type.compareTo("counties") == 0) {
            if(state.compareTo("Alabama") == 0 ) 
                mapReturned = mapCollection.find(eq("name", "alabama_counties")).first();
            else if(state.compareTo("Massachusetts") == 0 ) 
                mapReturned = mapCollection.find(eq("name", "massachusetts_counties")).first();
        }
        //Will be replaced with GridFS chunking
        else if(type.compareTo("precincts") == 0) {
            String gridFileName = null;
            if(state.compareTo("Alabama") == 0 ) {
                gridFileName = "alabama_precincts.json";                             
            }
            else if(state.compareTo("Massachusetts") == 0 ) {
                gridFileName = "massachusetts_precincts.json";
            }

            if (gridFileName != null) {
            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
               // Load file from GridFS
               GridFSFile file = gridFSBucket.find(Filters.eq("filename", gridFileName)).first();
               if (file != null) {
                    ObjectId fileId = file.getObjectId();
                    gridFSBucket.downloadToStream(fileId, outputStream);
                    String fileContents = outputStream.toString("UTF-8");
                    //System.out.println(fileContents);
                    mapReturned = Document.parse(fileContents);
                }
            } 
            catch (IOException e) {
               System.out.println("Error reading file from GridFS: " + e.getMessage());
            }
         }
        }
        Gson gson = new Gson();
        String json = gson.toJson(mapReturned);
        
        return Response.ok(json)
                .header("Access-Control-Allow-Origin", "http://localhost:3000")
                .header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .build();
    }
}