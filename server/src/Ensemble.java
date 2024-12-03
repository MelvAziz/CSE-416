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

@Path("/ensemble")
public class Ensemble {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getData(@QueryParam("state") String state, @QueryParam("sort") String sort, @Context UriInfo uriInfo) {
        ConnectionString connectionString = new ConnectionString("mongodb://localhost:27017");
        MongoClient client = MongoClients.create(connectionString);
        MongoDatabase database = client.getDatabase("CSE416");
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
                double[] populationArray = {0, 0, 0, 0, 0, 0, 0};
                for(int i = 0; i < 7; i++) {
                    String index = "" + i;
                    double totalPopulation = Double.parseDouble(((Document)districtPlan.get(index)).get("P0020001").toString()); 
                    double selectedPop = 0;
                    if(sort.compareTo("wht") == 0) {
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020005").toString());
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020013").toString())/2;
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020014").toString())/2;
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020015").toString())/2;
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020016").toString())/2;
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020017").toString())/2;
                    }
                    else if(sort.compareTo("blk") == 0) {
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020006").toString());
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020013").toString())/2;
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020018").toString())/2;
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020019").toString())/2;
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020020").toString())/2;
                        selectedPop += Double.parseDouble(((Document)districtPlan.get(index)).get("P0020021").toString())/2;
                    }
                    else if(sort.compareTo("hsp") == 0) {
                        selectedPop = Double.parseDouble(((Document)districtPlan.get(index)).get("P0020002").toString());
                    }
                    populationArray[i] = ((double)selectedPop)/((double)totalPopulation);
                }
                Arrays.sort(populationArray);
                district0[count] = populationArray[0];
                district1[count] = populationArray[1];
                district2[count] = populationArray[2];
                district3[count] = populationArray[3];
                district4[count] = populationArray[4];
                district5[count] = populationArray[5];
                district6[count] = populationArray[6];
                count++;
            }
            Arrays.sort(district0);
            Arrays.sort(district1);
            Arrays.sort(district2);
            Arrays.sort(district3);
            Arrays.sort(district4);
            Arrays.sort(district5);
            Arrays.sort(district6);
            double[][] demographicDataByDistrict = {district0, district1, district2, district3, district4, district5, district6};
            JsonArray plotData = new JsonArray();
            for (int i = 1; i <= 7; i++) {
                JsonObject boxPlot = new JsonObject();
                boxPlot.add("y", new JsonArray());
                boxPlot.getAsJsonArray("y").add(demographicDataByDistrict[i-1][0]);
                boxPlot.getAsJsonArray("y").add(demographicDataByDistrict[i-1][1250]);
                boxPlot.getAsJsonArray("y").add(demographicDataByDistrict[i-1][3750]);
                boxPlot.getAsJsonArray("y").add(demographicDataByDistrict[i-1][4999]);
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
            for (int i = 1; i <= 7; i++) {
                scatterPlot.getAsJsonArray("x").add(String.valueOf(i));
                scatterPlot.getAsJsonArray("y").add(demographicDataByDistrict[i-1][2500]);
            }

            plotData.add(scatterPlot);
            JsonObject plotLayout = new JsonObject();
            plotLayout.addProperty("title", "Distribution by Race");
            JsonObject yaxis = new JsonObject();
            if(sort.compareTo("blk") == 0)       yaxis.addProperty("title", "% of Population Black");
            else if(sort.compareTo("wht") == 0)  yaxis.addProperty("title", "% of Population White");
    
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
        return Response.ok("{}")
            .header("Access-Control-Allow-Origin", "http://localhost:3000")
            .header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            .header("Access-Control-Allow-Headers", "Content-Type")
            .build();
    }

}

