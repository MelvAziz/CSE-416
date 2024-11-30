import csv
import json

import json
open_json = open(r"C:\Users\Melvin\SBU\CSE-416\client\src\GeoData\massachusetts\massachusetts_precincts.json", 'r')
json_object = json.load(open_json)
with open(r"C:\Users\Melvin\SBU\CSE-416\client\src\GeoData\massachusetts\mass.csv", mode = "r") as file:
    reader = csv.DictReader(file)
    i = 0;
    count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    count2 = 0;
    for line in reader:
        # json_object["features"][i]["properties"]["TOT_POP22"] =     int(line["P0020001"])
        # json_object["features"][i]["properties"]["HSP_POP22"] =     int(line["P0020002"])
        # json_object["features"][i]["properties"]["WHT_NHSP22"] =    int(float(line["P0020005"]) + (float(line["P0020013"]) + float(line["P0020014"]) + float(line["P0020015"]) + float(line["P0020016"]) + float(line["P0020017"]))/2);
        # json_object["features"][i]["properties"]["BLK_NHSP22"] =    int(float(line["P0020006"]) + (float(line["P0020013"]) + float(line["P0020018"]) + float(line["P0020019"]) + float(line["P0020020"]) + float(line["P0020021"]))/2);
        # json_object["features"][i]["properties"]["AIA_NHSP22"] =    int(float(line["P0020007"]) + (float(line["P0020014"]) + float(line["P0020018"]) + float(line["P0020022"]) + float(line["P0020023"]) + float(line["P0020024"]))/2);
        # json_object["features"][i]["properties"]["ASN_NHSP22"] =    int(float(line["P0020008"]) + (float(line["P0020015"]) + float(line["P0020019"]) + float(line["P0020022"]) + float(line["P0020025"]) + float(line["P0020026"]))/2);
        # json_object["features"][i]["properties"]["OTH_NHSP22"] =    int(line["P0020010"]);

        # json_object["features"][i]["properties"]["10K_15K22"] =    int(line["E10K_15K22"]);
        # json_object["features"][i]["properties"]["15K_20K22"] =    int(line["E15K_20K22"]);
        # json_object["features"][i]["properties"]["20K_25K22"] =    int(line["E20K_25K22"]);
        # json_object["features"][i]["properties"]["25K_30K22"] =    int(line["E25K_30K22"]);
        # json_object["features"][i]["properties"]["30K_35K22"] =    int(line["E30K_35K22"]);
        # json_object["features"][i]["properties"]["35K_40K22"] =    int(line["E35K_40K22"]);
        # json_object["features"][i]["properties"]["40K_45K22"] =    int(line["E40K_45K22"]);
        # json_object["features"][i]["properties"]["45K_50K22"] =    int(line["E45K_50K22"]);
        # json_object["features"][i]["properties"]["50K_60K22"] =    int(line["E50K_60K22"]);
        # json_object["features"][i]["properties"]["60K_75K22"] =    int(line["E60K_75K22"]);
        # json_object["features"][i]["properties"]["75K_100K22"] =   int(line["E75K_100K22"]);
        # json_object["features"][i]["properties"]["100_125K22"] =   int(line["E100_125K22"]);
        # json_object["features"][i]["properties"]["125_150K22"] =   int(line["E125_150K22"]);
        # json_object["features"][i]["properties"]["150_200K22"] =   int(line["E150_200K22"]);
        # json_object["features"][i]["properties"]["200K_MOR22"] =   int(line["E200K_MOR22"]);
        # json_object["features"][i]["properties"]["LESS_10K22"] =   int(line["LESS_10K22"]);
        # json_object["features"][i]["properties"]["TOT_HOUS22"] =   int(line["TOT_HOUS22"]);
        count[0]+=float(line["P0020001"])
        count[1]+=float(line["G20PRERTRU"]);
        count[2]+=float(line["G20PREDBID"]);
        count[3]+=float(line["G20PREDBID"])+float(line["G20PRERTRU"])+float(line["G20PRELJOR"])+float(line["G20PREGHAW"])+float(line["G20PREOWRI"]);
        count[4]+=float(line["P0020005"]) + (float(line["P0020013"]) + float(line["P0020014"]) + float(line["P0020015"]) + float(line["P0020016"]) + float(line["P0020017"]))/2;
        count[5]+=float(line["P0020006"]) + (float(line["P0020013"]) + float(line["P0020018"]) + float(line["P0020019"]) + float(line["P0020020"]) + float(line["P0020021"]))/2;
        
        # i+=1;
    print(count);
    # with open(r"C:\Users\Melvin\SBU\CSE-416\output.json", "w") as outfile:
    #     json.dump(json_object, outfile)