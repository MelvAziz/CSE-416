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

        Double[] currentDistrictValues = new Double[districtNumber];
        MongoCollection<Document> mapsCollection = database.getCollection("maps");
        Document mapData = new Document();
        if(state.compareTo("Alabama") == 0) {
            mapData = mapsCollection.find(eq("name", "alabama_congressional_districts")).first();
        }
        else mapData = mapsCollection.find(eq("name", "massachusetts_congressional_districts")).first();
        List<Document> features = (List<Document>)(mapData.get("features"));
        for (int i = 0; i < districtNumber; i++) {
            double currentData = 0;
            mapData = (Document)(((Document)features.get(i)).get("properties"));
            double totalPop = Double.parseDouble((mapData.get("TOT_POP22")).toString());
            double totalHous = Double.parseDouble((mapData.get("TOT_HOUS22")).toString());
            if(sort.compareTo("wht") == 0)              currentData = Double.parseDouble(mapData.get("WHT_NHSP22").toString()) /totalPop;
            else if(sort.compareTo("blk") == 0)         currentData = Double.parseDouble(mapData.get("BLK_NHSP22").toString()) /totalPop;
            else if(sort.compareTo("E0_25k") == 0)      currentData = (Double.parseDouble(mapData.get("LESS_10K22").toString()) + Double.parseDouble(mapData.get("E10K_15K22").toString()) + Double.parseDouble(mapData.get("E15K_20K22").toString()) + Double.parseDouble(mapData.get("E20K_25K22").toString())) /totalHous;
            else if(sort.compareTo("E25_50k") == 0)     currentData = (Double.parseDouble(mapData.get("E25K_30K22").toString()) + Double.parseDouble(mapData.get("E30K_35K22").toString()) + Double.parseDouble(mapData.get("E35K_40K22").toString()) + Double.parseDouble(mapData.get("E40K_45K22").toString()) + Double.parseDouble(mapData.get("E45K_50K22").toString())) /totalHous;
            else if(sort.compareTo("E50_75k") == 0)     currentData = (Double.parseDouble(mapData.get("E50K_60K22").toString()) + Double.parseDouble(mapData.get("E60K_75K22").toString())) /totalHous;
            else if(sort.compareTo("E75_100k") == 0)    currentData = (Double.parseDouble(mapData.get("E75K_100K22").toString())) /totalHous;
            else if(sort.compareTo("E100_125k") == 0)   currentData = (Double.parseDouble(mapData.get("E100_125K22").toString())) /totalHous;
            else if(sort.compareTo("E125_150k") == 0)   currentData = (Double.parseDouble(mapData.get("E125_150K22").toString())) /totalHous;
            else if(sort.compareTo("E150k_MOR") == 0)   currentData = (Double.parseDouble(mapData.get("E150_200K22").toString()) + Double.parseDouble(mapData.get("E200K_MOR22").toString())) /totalHous;
            else if(sort.compareTo("urb") == 0)         currentData = Double.parseDouble(mapData.get("URBAN_POP").toString())    /totalPop;
            else if(sort.compareTo("sub") == 0)         currentData = Double.parseDouble(mapData.get("SUBURBAN_POP").toString()) /totalPop;
            else if(sort.compareTo("rur") == 0)         currentData = Double.parseDouble(mapData.get("RURAL_POP").toString())    /totalPop;
            currentDistrictValues[i] = currentData;
        }
        Arrays.sort(currentDistrictValues);
        for (int i = 0; i < districtNumber; i++) {
            scatterPlot.getAsJsonArray("x").add(String.valueOf(i));
            scatterPlot.getAsJsonArray("y").add(currentDistrictValues[i]);
        
        }

        plotData.add(scatterPlot);
        JsonObject plotLayout = new JsonObject();
        plotLayout.addProperty("title", "Distribution by Race");
        JsonObject yaxis = new JsonObject();
        if(sort.compareTo("blk") == 0)              yaxis.addProperty("title","% of Population Black");
        else if(sort.compareTo("wht") == 0)         yaxis.addProperty("title","% of Population White");
        else if(sort.compareTo("E0_25k") == 0)      yaxis.addProperty("title","% with income >25K");
        else if(sort.compareTo("E25_50k") == 0)     yaxis.addProperty("title","% with income 25-50K");
        else if(sort.compareTo("E50_75k") == 0)     yaxis.addProperty("title","% with income 50-75K");
        else if(sort.compareTo("E75_100k") == 0)    yaxis.addProperty("title","% with income 75-100K");
        else if(sort.compareTo("E100_125k") == 0)   yaxis.addProperty("title","% with income 100-125K");
        else if(sort.compareTo("E125_150k") == 0)   yaxis.addProperty("title","% with income 125-150K");
        else if(sort.compareTo("E150k_MOR") == 0)   yaxis.addProperty("title","% with income <150k");
        else if(sort.compareTo("urb") == 0)         yaxis.addProperty("title","% of Population Urban");
        else if(sort.compareTo("sub") == 0)         yaxis.addProperty("title","% of Population Suburban");
        else if(sort.compareTo("rur") == 0)         yaxis.addProperty("title","% of Population Rural");

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

