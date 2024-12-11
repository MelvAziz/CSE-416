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


@Path("/ensemble")
public class Ensemble {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getData(@QueryParam("state") String state, @QueryParam("sort") String sort, @Context UriInfo uriInfo) {
        ConnectionString connectionString = new ConnectionString("mongodb://localhost:27017");
        MongoClient client = MongoClients.create(connectionString);
        MongoDatabase database = client.getDatabase("CSE416");
        MongoCollection<Document> boxplotsCollection = database.getCollection("boxplots");
        Document boxPlotData = new Document();
        Integer districtNumber = 9;
        if(state.compareTo("Alabama") == 0) {
            boxPlotData = boxplotsCollection.find(eq("state", "Alabama")).first();
            districtNumber = 7;
        }
        else boxPlotData = boxplotsCollection.find(eq("state", "Mass")).first();

        if(sort.compareTo("wht") == 0) boxPlotData = (Document)(boxPlotData.get("WHITE"));
        else if(sort.compareTo("blk") == 0) boxPlotData = (Document)(boxPlotData.get("BLACK"));
        else if(sort.compareTo("E0_25k") == 0) boxPlotData = (Document)(boxPlotData.get("LESS_25K"));
        else if(sort.compareTo("E25_50k") == 0) boxPlotData = (Document)(boxPlotData.get("25K_50K"));
        else if(sort.compareTo("E50_75k") == 0) boxPlotData = (Document)(boxPlotData.get("50K_75K"));
        else if(sort.compareTo("E75_100k") == 0) boxPlotData = (Document)(boxPlotData.get("75K_100K"));
        else if(sort.compareTo("E100_125k") == 0) boxPlotData = (Document)(boxPlotData.get("100K_125K"));
        else if(sort.compareTo("E125_150k") == 0) boxPlotData = (Document)(boxPlotData.get("125K_150K"));
        else if(sort.compareTo("E150k_MOR") == 0) boxPlotData = (Document)(boxPlotData.get("MORE_150K"));
        else if(sort.compareTo("urb") == 0) boxPlotData = (Document)(boxPlotData.get("URBAN"));
        else if(sort.compareTo("sub") == 0) boxPlotData = (Document)(boxPlotData.get("SUBURBAN"));
        else if(sort.compareTo("rur") == 0) boxPlotData = (Document)(boxPlotData.get("RURAL"));
        else {
            return Response.ok("{}")
                    .header("Access-Control-Allow-Origin", "http://localhost:3000")
                    .header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                    .header("Access-Control-Allow-Headers", "Content-Type")
                    .build();
        }

        JsonArray plotData = new JsonArray();
        for (int i = 0; i < districtNumber; i++) {
            JsonObject boxPlot = new JsonObject();
            boxPlot.add("y", new JsonArray());
            Document currentDistrictData = ((Document)(boxPlotData.get(""+i+"")));
            

            boxPlot.getAsJsonArray("y").add(Double.parseDouble(((Document)(boxPlotData.get(""+i+""))).get("MIN").toString()));
            boxPlot.getAsJsonArray("y").add(Double.parseDouble(((Document)(boxPlotData.get(""+i+""))).get("Q1").toString()));
            boxPlot.getAsJsonArray("y").add(Double.parseDouble(((Document)(boxPlotData.get(""+i+""))).get("MED").toString()));
            boxPlot.getAsJsonArray("y").add(Double.parseDouble(((Document)(boxPlotData.get(""+i+""))).get("Q3").toString()));
            boxPlot.getAsJsonArray("y").add(Double.parseDouble(((Document)(boxPlotData.get(""+i+""))).get("MAX").toString()));

            boxPlot.addProperty("type", "box");
            boxPlot.addProperty("name", String.valueOf(i));
            JsonObject marker = new JsonObject();
            marker.addProperty("color", "blue");
            boxPlot.add("marker", marker);
            plotData.add(boxPlot);
        }

        JsonObject scatterPlot = new JsonObject();
        scatterPlot.add("x", new JsonArray());
        scatterPlot.add("y", new JsonArray());
        scatterPlot.addProperty("mode", "markers");
        scatterPlot.addProperty("type", "scatter");
        scatterPlot.addProperty("name", "Current Plan");
        JsonObject scatterMarker = new JsonObject();
        scatterMarker.addProperty("color", "red");
        scatterPlot.add("marker", scatterMarker);

        //Add current points later
        for (int i = 0; i < districtNumber; i++) {
            scatterPlot.getAsJsonArray("x").add(String.valueOf(i));
            scatterPlot.getAsJsonArray("y").add(Double.parseDouble(((Document)(boxPlotData.get(""+i+""))).get("MED").toString()));
        
        }

        plotData.add(scatterPlot);
        JsonObject plotLayout = new JsonObject();
        plotLayout.addProperty("title", "Distribution by Race");
        JsonObject yaxis = new JsonObject();
        if(sort.compareTo("blk") == 0)       yaxis.addProperty("title", "% of Population Black");
        else if(sort.compareTo("wht") == 0)  yaxis.addProperty("title", "% of Population White");

        JsonArray yaxisRange = new JsonArray();
        yaxisRange.add(0);
        // if(sort.charAt(1) == '0') yaxisRange.add(0.15);
        // else if(sort.charAt(0) == 'E') yaxisRange.add(0.1);
        // else yaxisRange.add(1);
        yaxisRange.add(1);
        yaxis.add("range", yaxisRange);
        plotLayout.add("yaxis", yaxis);
        JsonObject xaxis = new JsonObject();
        xaxis.addProperty("title", "District");

        plotLayout.add("xaxis", xaxis);
        plotLayout.addProperty("width", 700);
        plotLayout.addProperty("height", 600);

        JsonObject response = new JsonObject();
        response.add("plotData", plotData);
        response.add("plotLayout", plotLayout);

        Gson gson = new Gson();
        String json = gson.toJson(response);
        
        return Response.ok(json)
                .header("Access-Control-Allow-Origin", "http://localhost:3000")
                .header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .build();
    }

}

