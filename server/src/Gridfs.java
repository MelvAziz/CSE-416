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
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import com.mongodb.client.gridfs.model.GridFSFile;
import java.lang.reflect.Array;
import java.util.Arrays;
import org.w3c.dom.TypeInfo;

import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Files;
import java.io.IOException;
import java.nio.file.Paths;

public class Gridfs {
    public static void main(String[] args) {
        MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017");
        MongoDatabase database = mongoClient.getDatabase("CSE416");

        GridFSBucket gridFSBucket = GridFSBuckets.create(database);
        
        uploadFileToGridFS(gridFSBucket, "/Users/amychen/CSE-416/client/src/GeoData/alabama/alabama_precincts.json");
        uploadFileToGridFS(gridFSBucket, "/Users/amychen/CSE-416/client/src/GeoData/massachusetts/massachusetts_precincts.json");
        mongoClient.close();
    }

    // Method to upload file to GridFS
    public static void uploadFileToGridFS(GridFSBucket gridFSBucket, String filePath) {
        File file = new File(filePath);
        try (FileInputStream stream = new FileInputStream(file)) {
            // Optional: Define upload options (e.g., metadata)
            GridFSUploadOptions options = new GridFSUploadOptions()
                    .metadata(new Document("type", "precincts")
                            .append("extension", "json"));

            // Upload file to GridFS
            gridFSBucket.uploadFromStream(file.getName(), stream, options);
            System.out.println("File uploaded successfully.");
        } catch (IOException e) {
            System.err.println("Error uploading file: " + e.getMessage());
        }
    }
}

