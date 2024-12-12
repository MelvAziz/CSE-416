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
import com.mongodb.client.gridfs.model.GridFSFile;
import java.lang.reflect.Array;
import java.util.Arrays;
import org.w3c.dom.TypeInfo;

import java.io.File;
import java.nio.file.Files;
import java.io.IOException;
import java.nio.file.Paths;
// import java.util.stream.Gatherer;
// import javax.swing.text.Document;

@Path("/attributes")
public class Attributes {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getData(@QueryParam("type") String type, @QueryParam("state") String state, @QueryParam("featureName") String featureName, @Context UriInfo uriInfo) {
        ConnectionString connectionString = new ConnectionString("mongodb://localhost:27017");
        MongoClient client = MongoClients.create(connectionString);
        MongoDatabase database = client.getDatabase("CSE416");
        MongoCollection<Document> statesCollection = database.getCollection("states");
        MongoCollection<Document> mapCollection = database.getCollection("maps");
        Document dataReturned = new Document();
        if(type.compareTo("summary") == 0) {
            Document mapData = new Document();
            int districtNumber = 0;
            if(state.compareTo("alabama") == 0 ) {
                dataReturned = statesCollection.find(eq("state", "alabama")).first();
                mapData = mapCollection.find(eq("name", "alabama_congressional_districts")).first();
                districtNumber = 7;
            }
            else if(state.compareTo("massachusetts") == 0 ) {
                dataReturned = statesCollection.find(eq("state", "massachusetts")).first();
                mapData = mapCollection.find(eq("name", "massachusetts_congressional_districts")).first();
                districtNumber = 9;

            }
            List<Document> features = (List<Document>)(mapData.get("features"));
            String[] currentRepresentatives = new String[districtNumber];
            for (int i = 0; i < districtNumber; i++) {
                double currentData = 0;
                mapData = (Document)(((Document)features.get(i)).get("properties"));
                currentRepresentatives[Integer.parseInt((mapData.get("ID")).toString()) - 1] = (mapData.get("REPRESENTATIVE")).toString() + " (" + (mapData.get("PARTY")).toString() + ")";
            }
            dataReturned.append("representatives", currentRepresentatives);
            
            Gson gson = new Gson();
            String json = gson.toJson(dataReturned);
            return Response.ok(json)
                    .header("Access-Control-Allow-Origin", "http://localhost:3000")
                    .header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                    .header("Access-Control-Allow-Headers", "Content-Type")
                    .build();
            
        }
        else if(type.compareTo("congressional_districts") == 0) {
            if(state.compareTo("alabama") == 0 ) 
                dataReturned = mapCollection.find(eq("name", "alabama_congressional_districts")).first();
            else if(state.compareTo("Massachusetts") == 0 ) 
                dataReturned = mapCollection.find(eq("name", "massachusetts_congressional_districts")).first();
        }
        else if(type.compareTo("counties") == 0) {
            if(state.compareTo("alabama") == 0 ) 
                dataReturned = mapCollection.find(eq("name", "alabama_counties")).first();
            else if(state.compareTo("massachusetts") == 0 ) 
                dataReturned = mapCollection.find(eq("name", "massachusetts_counties")).first();
        }
        //Will be replaced with GridFS chunking
        else if(type.compareTo("precincts") == 0) {
            if(state.compareTo("alabama") == 0 ) {
                try {
                    String jsonFile = Files.readString(
                        Paths.get("C:\\Users\\Melvin\\SBU\\CSE-416\\client\\src\\GeoData\\alabama\\alabama_precincts.json")
                    );
                    dataReturned = Document.parse(jsonFile);
                }
                catch (IOException e) {
                    System.out.println("Error reading file: " + e.getMessage());
                }

            }
            else if(state.compareTo("massachusetts") == 0 ) {
                try {
                    String jsonFile = Files.readString(
                        Paths.get("C:\\Users\\Melvin\\SBU\\CSE-416\\client\\src\\GeoData\\massachusetts\\massachusetts_precincts.json")
                    );
                    dataReturned = Document.parse(jsonFile);
                }
                catch (IOException e) {
                    System.out.println("Error reading file: " + e.getMessage());
                }
            }
        }
        Document features = ((Document)dataReturned.get("features"));
        //TO DO: Process features and return the feature defined by featureName
        Gson gson = new Gson();
        String json = gson.toJson(features);
        
        return Response.ok(json)
                .header("Access-Control-Allow-Origin", "http://localhost:3000")
                .header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .build();
    }
}

