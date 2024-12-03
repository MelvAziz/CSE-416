import sys
import geopandas as gpd
import json

# This code will generate the adjacent precincts for a single precinct. 
# The code is meant to be run in parallel using gnuparallel.

METERS_TO_FEET_CONVERSION = 3.28084
MINIMUM_BOUNDARY_LENGTH = 200 # Units are feet
MAXIMUM_PRECINCT_DISTANCE = 200 # Units are feet
state = sys.argv[1].lower()
if state != "alabama" and state != "mass":
    print("State should be either 'mass' or 'alabama'.")
    exit()
precincts_geojson_file = f"/gpfs/projects/CSE416/Owls/scripts/geojson-files/{state}_precincts_for_intersection.geojson"
precincts_geopandas_data_frame = gpd.read_file(precincts_geojson_file)
input_precinct_index = int(sys.argv[2])
input_precinct_geoseries = gpd.GeoSeries(precincts_geopandas_data_frame.iloc[input_precinct_index].geometry).make_valid()
intersection_list = []
for precinct_index in range(0, len(precincts_geopandas_data_frame)):
    if input_precinct_index != precinct_index:
        precinct_geoseries = gpd.GeoSeries(precincts_geopandas_data_frame.iloc[precinct_index].geometry).make_valid()
        common_boundary_length = input_precinct_geoseries.intersection(precinct_geoseries).length.item() * METERS_TO_FEET_CONVERSION
        precinct_distance = input_precinct_geoseries.distance(precinct_geoseries).item()
        if common_boundary_length >= MINIMUM_BOUNDARY_LENGTH  and precinct_distance <= MAXIMUM_PRECINCT_DISTANCE:
            intersection_list.append(precinct_index)
# Build adjacency JSON for precinct in the format that the gerrychain module expects
adjacency_dict = {}
adjacency_dict["adjacency"] = []
for id in intersection_list:
    id_dict = {}
    id_dict["id"] = id
    adjacency_dict["adjacency"].append(id_dict)
f = open(f"/gpfs/projects/CSE416/Owls/{state}/adjacency/{precinct_index}.json", "w")
json.dump(adjacency_dict, f)

