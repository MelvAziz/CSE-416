import sys
import geopandas as gpd
import matplotlib.pyplot as plt
import json

# set file path
file = "./mass_precincts.geojson"

# read in all geodata
df = gpd.read_file(file)

# calculate intersections
test_index = int(sys.argv[1])
print(df.crs.axis_info[0].unit_name)
intersects = []
# test current precinct against all other precincts
for i in range(0, len(df)):
    if (test_index != i): # don't test against self
        series1 = gpd.GeoSeries(df.iloc[test_index].geometry).make_valid()
        series2 = gpd.GeoSeries(df.iloc[i].geometry).make_valid()
        common_boundary_length = series1.intersection(series2).length.item() * 3.28084
        precinct_distance = series1.distance(series2).item()
        if (common_boundary_length >= 200 and precinct_distance <= 200):
            intersects.append(i)

adj_dict = {}
adj_dict["adjacency"] = []
for i in intersects:
    dict = {}
    dict["id"] = i
    adj_dict["adjacency"].append(dict)

f = open(f"/gpfs/scratch/mborczuk/gerryintersections-alabama/{test_index}.json", "w")
json.dump(adj_dict, f)

