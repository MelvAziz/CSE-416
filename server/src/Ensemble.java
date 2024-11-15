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

// import javax.ws.rs.DefaultValue;
// import javax.ws.rs.GET;
// import javax.ws.rs.Path;
// import javax.ws.rs.Consumes;
// import javax.ws.rs.QueryParam;
// import javax.ws.rs.core.MultivaluedMap;
// import javax.ws.rs.core.UriInfo;


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

@Path("/ensemble")
public class Ensemble {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getData(@QueryParam("state") String state, @QueryParam("sort") String sort, @Context UriInfo uriInfo) {
        //Set up a connection to MongoDB
        ConnectionString connectionString = new ConnectionString("mongodb://localhost:27017");
        MongoClient mongoClient = MongoClients.create(connectionString);
        //Connect to CSE416 DB and gerrychain COllection
        MongoDatabase database = mongoClient.getDatabase("CSE416");
        MongoCollection<Document> gerrychainCollection = database.getCollection("gerrychain");
        MongoCursor<Document> allDistrictPlans = gerrychainCollection.find().iterator();
        if(state.compareTo("Alabama") == 0) {
            double[] district0 = new double[5000];
            double[] district1 = new double[5000];
            double[] district2 = new double[5000];
            double[] district3 = new double[5000];
            double[] district4 = new double[5000];
            double[] district5 = new double[5000];
            double[] district6 = new double[5000];
            int count = 0;
            while(allDistrictPlans.hasNext()) {
                Document districtPlan = allDistrictPlans.next();
                double[] popArray = {0, 0, 0, 0, 0, 0, 0};
                for(int i = 0; i < 7; i++) {
                    String index = "" + i;
                    double totalPop = Double.parseDouble(((Document)districtPlan.get(index)).get("P0020001").toString());
                    double selectedPop = 0;
                    if(sort.compareTo("wht") == 0) {
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020005").toString());
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020013").toString());
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020014").toString());
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020015").toString());
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020016").toString());
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020017").toString());
                    }
                    else if(sort.compareTo("blk") == 0) {
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020006").toString());
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020013").toString());
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020018").toString());
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020019").toString());
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020020").toString());
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020021").toString());
                    }
                    else if(race.compareTo("hsp") == 0) {
                        selectedPop = Double.parseDouble(((Document)districtPlan.get(index)).get("P0020002").toString());
                    }
                    // System.out.println(selectedPop);
                    popArray[i] = ((double)selectedPop)/((double)totalPop);
                }
                Arrays.sort(popArray);
                district0[count] = popArray[0];
                district1[count] = popArray[1];
                district2[count] = popArray[2];
                district3[count] = popArray[3];
                district4[count] = popArray[4];
                district5[count] = popArray[5];
                district6[count] = popArray[6];
                count++;
                // System.out.println(((Document)districtPlan.get("0")).get("P0010001"));
                //int(float(line["P0020006"]) + (float(line["P0020013"]) + float(line["P0020018"]) + float(line["P0020019"]) + float(line["P0020020"]) + float(line["P0020021"]))/2);
            }
            Arrays.sort(district0);
            Arrays.sort(district1);
            Arrays.sort(district2);
            Arrays.sort(district3);
            Arrays.sort(district4);
            Arrays.sort(district5);
            Arrays.sort(district6);

            double[][] superArr = {district0, district1, district2, district3, district4, district5, district6};
            JsonArray plotData = new JsonArray();
            for (int i = 1; i <= 7; i++) {
                JsonObject boxPlot = new JsonObject();
                boxPlot.add("y", new JsonArray());
                boxPlot.getAsJsonArray("y").add(superArr[i-1][0]);
                boxPlot.getAsJsonArray("y").add(superArr[i-1][1250]);
                boxPlot.getAsJsonArray("y").add(superArr[i-1][3750]);
                boxPlot.getAsJsonArray("y").add(superArr[i-1][4999]);
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

            for (int i = 1; i <= 7; i++) {
                scatterPlot.getAsJsonArray("x").add(String.valueOf(i));
                scatterPlot.getAsJsonArray("y").add(superArr[i-1][2500]);
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
}

