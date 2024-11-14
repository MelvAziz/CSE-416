import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;


import com.mongodb.*;
import org.bson.BsonDocument;
import org.bson.BsonInt64;
import org.bson.Document;
import org.bson.conversions.Bson;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

@Path("/data")
public class MyResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getData() {

        JsonArray plotData = new JsonArray();
        for (int i = 1; i <= 9; i++) {
            JsonObject boxPlot = new JsonObject();
            boxPlot.add("y", new JsonArray());
            boxPlot.getAsJsonArray("y").add(0.1 + i * 0.01);
            boxPlot.getAsJsonArray("y").add(0.12 + i * 0.01);
            boxPlot.getAsJsonArray("y").add(0.18 + i * 0.01);
            boxPlot.getAsJsonArray("y").add(0.20 + i * 0.01);
            boxPlot.addProperty("type", "box");
            boxPlot.addProperty("name", String.valueOf(i));
            JsonObject marker = new JsonObject();
            marker.addProperty("color", "blue");
            boxPlot.add("marker", marker);
            plotData.add(boxPlot);
        }

        // Example scatter plot data
        JsonObject scatterPlot = new JsonObject();
        scatterPlot.add("x", new JsonArray());
        scatterPlot.add("y", new JsonArray());
        scatterPlot.addProperty("mode", "markers");
        scatterPlot.addProperty("type", "scatter");
        scatterPlot.addProperty("name", "Current Plan");
        JsonObject scatterMarker = new JsonObject();
        scatterMarker.addProperty("color", "red");
        scatterPlot.add("marker", scatterMarker);
        
        for (int i = 1; i <= 9; i++) {
            scatterPlot.getAsJsonArray("x").add(String.valueOf(i));
            scatterPlot.getAsJsonArray("y").add(0.1 + (i * 0.01));
        }
        plotData.add(scatterPlot);

         JsonObject plotLayout = new JsonObject();
         plotLayout.addProperty("title", "Distribution by Race");

         JsonObject yaxis = new JsonObject();
         yaxis.addProperty("title", "% of Population Black");
 
         JsonArray yaxisRange = new JsonArray();
         yaxisRange.add(0);
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
