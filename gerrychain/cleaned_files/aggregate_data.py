import geopandas as gpd
from create_attribute_list import (get_aggregatable_attributes, 
                                   get_non_aggregatable_attributes)
import json
import csv
import sys


state = sys.argv[1].lower()
if state != "alabama" and state != "mass":
    print("State should be either 'mass' or 'alabama'.")
    exit()
precincts_geojson_file = f"/gpfs/projects/CSE416/Owls/scripts/geojson-files/{state}_precincts.geojson"
precincts_geopandas_data_frame = gpd.read_file(precincts_geojson_file)
output_dict = {}
output_dict["directed"] = False
output_dict["multigraph"] = False
output_dict["graph"] = []
output_dict["nodes"] = []
output_dict["adjacency"] = []
output_csv = open(f"/gpfs/projects/CSE416/Owls/{state}/{state}.csv", "w")
output_csv_writer = csv.writer(output_csv, delimiter=',')
aggregatable_attributes = get_aggregatable_attributes("all", True)
non_aggregatable_attributes = get_non_aggregatable_attributes(state)
output_csv_header = ["UNIQUE_ID", "NODE_ID"]
for attribute in aggregatable_attributes:
    output_csv_header.append(attribute)
for attribute in non_aggregatable_attributes:
    output_csv_header.append(attribute)
output_csv_writer.writerow(output_csv_header)
for precinct_index in range(0, len(precincts_geopandas_data_frame)):
    precinct_geoseries = gpd.GeoSeries(
        precincts_geopandas_data_frame.iloc[precinct_index].geometry)
    precinct_center = precinct_geoseries.centroid
    precinct_node = {}
    precinct_node["x"] = precinct_center[0].x
    precinct_node["y"] = precinct_center[0].y
    precinct_node["id"] = precinct_index
    precinct_unique_id = ""
    if state == "alabama":
        precinct_unique_id = precincts_geopandas_data_frame.iloc[precinct_index].UNIQUE_ID
    else:
        precinct_unique_id = precincts_geopandas_data_frame.iloc[precinct_index].WP_NAME
    csv_row = [precinct_unique_id, precinct_index]
    for attribute in aggregatable_attributes:
        precinct_attribute_file = open(
            f"/gpfs/projects/CSE416/Owls/{state}/attributes/{attribute}/{precinct_index}.txt", "r")
        attribute_total = float(precinct_attribute_file.readlines()[-1])
        precinct_node[attribute] = attribute_total
        csv_row.append(attribute_total)
    for attribute in non_aggregatable_attributes:
        attribute_total = int(
            getattr(precincts_geopandas_data_frame.iloc[precinct_index], attribute))
        precinct_node[attribute] = attribute_total
        csv_row.append(attribute_total)
    output_csv_writer.writerow(csv_row)
    output_dict["nodes"].append(precinct_node)
    adjacency_file = open(
        f"/gpfs/projects/CSE416/Owls/{state}/adjacency/{precinct_index}.json", "r")
    adjacency_dict = json.load(adjacency_file)
    output_dict["adjacency"].append(adjacency_dict["adjacency"])
output_json = open(f"/gpfs/projects/CSE416/Owls/{state}/{state}.json", "w")
json.dump(output_dict, output_json)
