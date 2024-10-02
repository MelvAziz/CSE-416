import sys
import geopandas as gpd
import matplotlib.pyplot as plt
import json

# set file path
file = "./alabama_precincts.json"

# read in all geodata
df = gpd.read_file(file)

# calculate intersections
test_index = int(sys.argv[1])

intersects = []
# test current precinct against all other precincts
for i in range(0, len(df)):
    if (test_index != i): # don't test against self
        series1 = gpd.GeoSeries(df.iloc[test_index].geometry).make_valid()
        series2 = gpd.GeoSeries(df.iloc[i].geometry).make_valid()
        if (series1.intersects(series2).item()):
            intersects.append(i)

adj_dict = {}
adj_dict["adjacency"] = []
for i in intersects:
    dict = {}
    dict["id"] = i
    adj_dict["adjacency"].append(dict)

f = open(f"/gpfs/scratch/mborczuk/gerryintersections/{test_index}.json", "w")
json.dump(adj_dict, f)
    # # visualization
    # base_series = gpd.GeoSeries(df.iloc[test_index].geometry)
    # base_center = base_series.centroid

    # base = gpd.GeoSeries(df.iloc[test_index].geometry).plot()
    # base.annotate(test_index, (base_center[0].x, base_center[0].y), color='black')

    # for i in range(0, len(df)):
    #     if (i == test_index):
    #         continue
    #     series = gpd.GeoSeries(df.iloc[i].geometry)
    #     center = series.centroid
    #     p = gpd.GeoSeries(df.iloc[i].geometry).plot(ax=base)
    #     if (i in intersects):
    #         p.annotate(str(i), (center[0].x, center[0].y), color='green')

    # plt.show()
